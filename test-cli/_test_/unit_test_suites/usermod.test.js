const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const usermod = require('./../../../CLI/admin/admin_utils/usermod.js')

test('Unit Test for usermod function (case: correct input)', async () => {
    const res = await usermod.usermod(baseURL, jwt, 'new_user', '123456789', 'operator', 'AO');
    expect(res).toBe(200);
})

test('Unit Test for usermod function (case: invalid input)', async () => {
    const res = await usermod.usermod(baseURL, jwt, 'new_user', '123456789', 'not valid', 'not valid');
    expect(res).toBe(400);
})

test('Unit Test for usermod function (case: not authorized user)', async () => {
    const res = await usermod.usermod(baseURL, false_jwt, 'new_user', '123456789', 'operator', 'AO');
    expect(res).toBe(401);
})