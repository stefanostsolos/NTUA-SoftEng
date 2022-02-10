const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const settlementsbyoperator = require('./../../../CLI/utils/settlementsbyoperator.js')

test('Unit Test for settlementsbyoperator function (case: correct input)', async () => {
    const res = await settlementsbyoperator.settlementsbyoperator(baseURL, jwt, 'EG', 'json');
    expect(res).toBe(200)
})

test('Unit Test for settlementsbyoperator function (case: invalid input)', async () => {
    const res = await settlementsbyoperator.settlementsbyoperator(baseURL, jwt, 'Invalid input', 'json');
    expect(res).toBe(400)
})

test('Unit Test for settlementsbyoperator function (case: not authorized user)', async () => {
    const res = await settlementsbyoperator.settlementsbyoperator(baseURL, false_jwt, 'EG', 'json');
    expect(res).toBe(401)
})