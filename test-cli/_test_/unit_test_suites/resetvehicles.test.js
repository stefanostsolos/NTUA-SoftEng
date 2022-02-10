const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const resetvehicles = require('./../../../CLI/admin/resetvehicles.js')

test('Unit Test for resetvehicles function (case: correct input)', async () => {
    const res = await resetvehicles.resetvehicles(baseURL, jwt);
    expect(res).toBe(200)
})