# kv

A tiny library for working with key-value (KV) data in k6.

Supports both local and cloud-based tests.

## Usage

You can use the `kv` object to set, get, and delete key-value pairs:
```javascript
import { kv } from 'https://raw.githubusercontent.com/dgzlopes/kv/refs/heads/main/kv.js';

// Make sure we start with a clean slate
export async function setup() {
    await kv.flush();
}

// Set a random key-value pair on each iteration
export default async function () {
    await kv.set(`foo`, `bar`);
}

// Get five random key-value pair at the end
export async function teardown() {
    console.log(await kv.get(`foo`));
}
```

A more fancy example is available in `example.js`.

## How it works

### Local execution

- When running the test locally:
    - The library attempts to use https://github.com/oleiade/xk6-kv/
    - Run `xk6 build --with github.com/oleiade/xk6-kv`to generate a new binary that has it.

### Cloud execution
- When running the test in the cloud:
    - The library uses aan external Redis instance.
    - Set the `KV_URL` [environment variable](https://grafana.com/docs/k6/latest/using-k6/environment-variables/) with a valid Redis URL.

## Upstash Integration

This library has been tested with Upstash, a serverless Redis provider.

To use Upstash with this library:
1. Create an account on [Upstash](https://upstash.com/).
2. Create a new Redis instance.
3. Get the Redis URL.
4. Set the `KV_URL` environment variable with the Redis URL.

That's it! You can now use the `kv` object to work with your data. Also, you can also use their Rest API or CLI to [create new DBs dynamically](https://upstash.com/docs/devops/developer-api/redis/create_database_global) (e.g. one per test run) or to pre-populate the DB with data.