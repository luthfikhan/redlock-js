# RedLock-JS

RedLock is a TypeScript library for acquiring and releasing locks using Redis, designed for use in Node.js applications.

## Installation

Install the RedLock library using npm:

```bash
npm install redlock-js
```

## Usage
To use RedLock in your Node.js application, follow these steps:

1. Import the RedLock class:

```JavaScript
import RedLock, { LockOptions } from 'redlock-js';
```

2. Create an instance of RedLock with the required configuration:

```JavaScript
const lockOptions: LockOptions = {
  redis: {
    host: 'localhost',
    port: 6379,
  },
  key: 'my-lock',
  interval: 100, // Optional, specify the retry interval in milliseconds
};

const redlock = new RedLock(lockOptions);
```

3. Acquire and release locks as needed:

```JavaScript
// Acquire a lock
await redlock.lock();

// Perform your critical section of code here

// Release the lock when done
await redlock.release();

```

## Configuration Options
You can configure RedLock by providing options when creating an instance:

- `redis`: Redis connection options.
- `cluster`: If you're using a Redis cluster, provide cluster configuration.
- `key`: The unique key for your lock.
- `interval` (optional): Retry interval in milliseconds when attempting to acquire the lock.