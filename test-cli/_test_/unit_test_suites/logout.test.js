const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const logout = require('./../../../CLI/utils/logout.js')

test('Unit Test for logout function (case: correct input)', async () => {
    const res = await logout.logout(baseURL, jwt);
    expect(res).toBe(200)
})

test('Unit Test for logout function (case: not authorized user)', async () => {
    const res = await logout.logout(baseURL, false_jwt);
    expect(res).toBe(401)
})