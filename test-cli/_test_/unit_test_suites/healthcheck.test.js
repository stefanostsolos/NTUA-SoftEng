const baseURL = 'http://localhost:9103/interoperability/api';
const healthcheck = require('./../../../CLI/admin/healthcheck.js')

test('Unit Test for Healthcheck function', async () => {
    const res = await healthcheck.healthcheck(baseURL);
    expect(res).toBe(200)
})