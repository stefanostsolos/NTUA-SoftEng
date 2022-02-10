const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const users = require('./../../../CLI/admin/admin_utils/users.js')

test('Unit Test for users function (case: correct input)', async () => {
    const res1 = await users.users(baseURL, jwt);
    expect(res1).toBe(200);
    const res2 = await users.users(baseURL, jwt, 'admin');
    expect(res2).toBe(200);
})

test('Unit Test for users function (case: wrong input)', async () => {
    const res = await users.users(baseURL, jwt, 'not valid');
    expect(res).toBe(400);
})

test('Unit Test for users function (case: not authorized user)', async () => {
    const res1 = await users.users(baseURL, false_jwt);
    expect(res1).toBe(401);
    const res2 = await users.users(baseURL, false_jwt, 'admin');
    expect(res2).toBe(401);
})