const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const chargesby = require('./../../../CLI/utils/chargesby.js')

test('Unit Test for chargesby function (casae: correct input)', async () => {
    const res = await chargesby.chargesby(baseURL, jwt, 'AO', '20210419', '20210619', 'json');
    expect(res).toBe(200)
})

test('Unit Test for chargesby function (case: invalid input)', async () => {
    const res = await chargesby.chargesby(baseURL, jwt, 'AE', '20210419', '20210619', 'json');
    expect(res).toBe(400)
})

test('Unit Test for chargesby function (case: not authorized user)', async () => {
    const res = await chargesby.chargesby(baseURL, false_jwt + '1', 'AO', '20210419', '20210619', 'json');
    expect(res).toBe(401)
})