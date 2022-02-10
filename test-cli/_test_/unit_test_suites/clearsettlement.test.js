const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const clearsettlement = require('./../../../CLI/utils/clearsettlement.js')

test('Unit Test for clearsettlement function (case: correct input)', async () => {
    const res = await clearsettlement.clearsettlement(baseURL, jwt, 'WGSI08TUQL');
    expect(res).toBe(200)
})

test('Unit Test for clearsettlement function (case: invalid input)', async () => {
    const res = await clearsettlement.clearsettlement(baseURL, jwt, 'wrond_id');
    expect(res).toBe(400)
})

test('Unit Test for clearsettlement function (case: not authorized user)', async () => {
    const res = await clearsettlement.clearsettlement(baseURL, false_jwt, 'WGSI08TUQL');
    expect(res).toBe(401)
})