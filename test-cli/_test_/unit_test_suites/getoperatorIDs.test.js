const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const getoperatorIDs = require('./../../../CLI/utils/getoperatorIDs.js')

test('Unit Test for getoperatorIDs function (case: correct input)', async () => {
    const res = await getoperatorIDs.getoperatorIDs(baseURL, jwt);
    expect(res).toBe(200)
})

test('Unit Test for getoperatorIDs function (case: not authorized user)', async () => {
    const res = await getoperatorIDs.getoperatorIDs(baseURL, false_jwt);
    expect(res).toBe(401)
})