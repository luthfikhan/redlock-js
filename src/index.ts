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
};

class RedLock {
  private client: any;
  private key: string;

  constructor(private options: LockOptions) {
    this.key = "lock:${this.options.key}";

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

    this.cleanUp()
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async setnx() {
    const lockValue = new Date().toString();
    const result = await this.client.setnx(this.key, lockValue);

    return result === 0;
  }

  async lock() {
    let isLock = false;

    do {
      await this.delay(this.options.interval ?? 100);

      isLock = await this.setnx();
    } while (isLock);

    return Promise.resolve();
  }

  async release() {
    await this.client.del(this.key);
  }

  private cleanUp() {
    const clean = () => {
      this.release().finally(() => {
        process.exit()
      })
    }
    ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM"].forEach((eventType) => {
      process.on(eventType, clean);
    })
  }
}

export default RedLock;
