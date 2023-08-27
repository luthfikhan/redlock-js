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
- `interval` (default: 100): Retry interval in milliseconds when attempting to acquire the lock.
- `expire` (default: 300):  Expiration time in seconds for the lock key. Setting an expiration time allows you to automatically release the lock after a certain duration, effectively locking a resource without needing an explicit release operation.

## Additional Functionality
### Automatic Cleanup
RedLock includes an automatic cleanup function that can be used to clean up leftover lock keys. You can use the `clean` method to scan and delete expired lock keys from the Redis database.

```JavaScript
await redlock.clean();
```
By calling the `clean` method, you can ensure that expired lock keys are removed, preventing potential issues with stale locks.

### Checking Lock Status
You can also check whether a lock is currently active using the `isLocking` method:

```JavaScript
const lockingStatus = await redlock.isLocking();
console.log(`Is locking: ${lockingStatus}`);
```
The `isLocking` method returns a boolean indicating whether the lock is currently active or not.

### Close the Redis Connection
To properly release resources and end the Redis connection, use the `end` method:

```JavaScript
await redlock.end();
```
Calling the `end` method will gracefully close the connection to the Redis server. Additionally, when you call the `release` method, the lock will be released and the associated Redis connection will be closed.

<a href="https://www.buymeacoffee.com/luthfikhan">
  <img width="200" src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-1.svg" />
</a>