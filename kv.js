import redis from 'k6/experimental/redis';
import exec from 'k6/execution';


export class KV {
  constructor() {
    this.isCloud = !!__ENV.K6_CLOUDRUN_INSTANCE_ID;
    const cloudKVUrl = __ENV.KV_URL;

    if (this.isCloud) {
      if (!cloudKVUrl) {
        exec.test.abort(
          'Error: This test is running in K6 Cloud, but KV_URL is missing. Please provide KV_URL to use KV operations.'
        );
      } else {
        this.cloudKV = this.isCloud ? new redis.Client(cloudKVUrl) : null;
      }
    } else {
      try {
        const xkv = require('k6/x/kv');
        this.localKV = xkv.openKv();
      } catch (e) {
        exec.test.abort('To use KV operations locally, you need to have the k6/x/kv module installed (https://github.com/oleiade/xk6-kv).');
      }
    }
  }

  async set(key, value) {
      if (this.isCloud) {
        return await this.cloudKV.set(key, value);
      } else {
        return await this.localKV.set(key, value);
      }
    }

  async get(key) {
      if (this.isCloud) {
        return await this.cloudKV.get(key);
      } else {
        return await this.localKV.get(key);
      }
    }

  async del(key) {
      if (this.isCloud) {
        return await this.cloudKV.del(key);
      } else {
        return await this.localKV.del(key);
      }
    }

  async randomKey() {
      if (this.isCloud) {
        return await this.cloudKV.randomKey();
      } else {
        var entries = await this.localKV.list();
        return entries[Math.floor(Math.random() * entries.length)].key;
      }
    }

  async flush() {
      if (this.isCloud) {
        return await this.cloudKV.sendCommand('FLUSHALL');
      } else {
        return await this.localKV.clear();
      }
    }
  }

  export const kv = new KV();
