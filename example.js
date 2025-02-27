import { kv } from './kv.js';
import { sleep } from 'k6';
import exec from 'k6/execution';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export let options = {
    vus: 10,
    duration: '5s',
    cloud: {
        projectID: 3738565,
        name: 'Test (27/02/2025-12:57:06)',
        distribution: {
            ashburn: { loadZone: 'amazon:us:ashburn', percent: 50 },
            dublin: { loadZone: 'amazon:ie:dublin', percent: 50 },
        },
    }
};

// Make sure we start with a clean slate
export async function setup() {
    await kv.flush();
}

// Set a random key-value pair on each iteration
export default async function () {
    await kv.set(`instance_${getInstanceName()}.interation_${exec.vu.iterationInInstance}`, randomString(8));
    sleep(1);
}

// Get five random key-value pair at the end
export async function teardown() {
    for (let i = 0; i < 5; i++) {
        var key = await kv.randomKey();
        var value = await kv.get(key);
        console.log(`Key: ${key}, Value: ${value}`);
    }
}

// Helper function to get the instance name (not supported by the execution API atm)
function getInstanceName() {
    if (__ENV.K6_CLOUDRUN_INSTANCE_ID) {
        return __ENV.K6_CLOUDRUN_INSTANCE_ID;
    } else {
        return 'local';
    }
}