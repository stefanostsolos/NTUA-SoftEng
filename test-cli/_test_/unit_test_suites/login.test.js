const baseURL = 'http://localhost:9103/interoperability/api';
const login = require('./../../../CLI/utils/login.js')

test('Unit Test for login function (case: correct input)', async () => {
    const res = await login.login(baseURL, 'admin', 'freepasses4all');
    expect(res).toBe(200)
})

test('Unit Test for login function (case: invalid password)', async () => {
    const res = await login.login(baseURL, 'admin', 'notvalid');
    expect(res).toBe(401)
})

test('Unit Test for login function (case: invalid username)', async () => {
    const res = await login.login(baseURL, 'not valid', '123456789');
    expect(res).toBe(400)
})