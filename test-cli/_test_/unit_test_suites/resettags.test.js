const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const resettags = require('./../../../CLI/admin/resettags.js')

test('Unit Test for resettags function (case: correct input)', async () => {
    const res = await resettags.resettags(baseURL, jwt);
    expect(res).toBe(200)
})