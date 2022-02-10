const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const resetpasses = require('./../../../CLI/admin/resetpasses.js')

test('Unit Test for resetpasses function (case: correct input)', async () => {
    const res = await resetpasses.resetpasses(baseURL, jwt);
    expect(res).toBe(200)
}, 20000)