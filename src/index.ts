import Redis, {
  Cluster,
  RedisOptions,
  ClusterNode,
  ClusterOptions,
} from "ioredis";

export type LockOptions = {
  redis?: RedisOptions;
  cluster?: {
    nodes: ClusterNode[];
    options: ClusterOptions;
  };
  key: string;
  interval?: number;
  expire?: number,
};

class RedLock {
  private client: Redis | Cluster;
  private key: string;
  private prefix = 'redlock-js:'
  private expire = 300;

  constructor(private options: LockOptions) {
    this.key = `${this.prefix}${this.options.key}`;

    if (!this.options.cluster && !this.options.redis) {
      throw new Error("Setup your redis connection please!");
    }

    if (this.options.cluster) {
      this.client = new Cluster(
        this.options.cluster.nodes,
        this.options.cluster.options
      );
    } else {
      this.client = new Redis(this.options.redis!);
    }

    this.client.on("error", (error: any) => {
      throw error;
    });
  }

  async lock() {
    let isLock = false;

    do {
      isLock = await this.setnx();

      await this.delay(this.options.interval ?? 100);
    } while (isLock);

    return Promise.resolve();
  }

  async release() {
    await this.client.del(this.key);
    await this.end()
  }

  async clean() {
    let cursor = '0';
    do {
      const result = await this.client.scan(cursor, "MATCH", `${this.prefix}*`)
  
      if (Array.isArray(result) && result[1].length > 0) {
        await this.client.del(...result[1]);
      }
  
      cursor = result[0];
    } while (cursor !== '0');
  }

  async isLocking() {
    const result = await this.client.get(this.key)

    return Boolean(result)
  }

  async end() {
    await this.client.quit()
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async setnx() {
    const lockValue = new Date().toString();
    const result = await this.client.setnx(this.key, lockValue);

    if (result === 1) {
      this.client.expire(this.key, this.options.expire ?? this.expire)
    }

    return result === 0;
  }
}

export default RedLock;
