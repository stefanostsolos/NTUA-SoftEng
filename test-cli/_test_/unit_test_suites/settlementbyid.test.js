const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const settlementbyid = require('./../../../CLI/utils/settlementbyid.js')

test('Unit Test for settlementbyid function (case: correct input)', async () => {
    const res = await settlementbyid.settlementbyid(baseURL, jwt, '8X01WHCZ11', 'json');
    expect(res).toBe(200)
})

test('Unit Test for settlementbyid function (case: invalid input)', async () => {
    const res = await settlementbyid.settlementbyid(baseURL, jwt, '8X01WHCZ11', 'invalid format');
    expect(res).toBe(400)
})

test('Unit Test for settlementbyid function (case: not authorized user)', async () => {
    const res = await settlementbyid.settlementbyid(baseURL, false_jwt, '8X01WHCZ11', 'json');
    expect(res).toBe(401)
})