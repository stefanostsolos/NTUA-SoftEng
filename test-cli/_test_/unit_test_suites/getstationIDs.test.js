const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const getstationIDs = require('./../../../CLI/utils/getstationIDs.js')

test('Unit Test for getstationIDs function (case: correct input)', async () => {
    const res = await getstationIDs.getstationIDs(baseURL, jwt);
    expect(res).toBe(200)
})

test('Unit Test for getstationIDs function (case: not authorized user)', async () => {
    const res = await getstationIDs.getstationIDs(baseURL, false_jwt);
    expect(res).toBe(401)
})