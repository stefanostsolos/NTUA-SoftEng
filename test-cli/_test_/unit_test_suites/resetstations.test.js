const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const resetstations = require('./../../../CLI/admin/resetstations.js')

test('Unit Test for resetstations function (case: correct input)', async () => {
    const res = await resetstations.resetstations(baseURL, jwt);
    expect(res).toBe(200)
})