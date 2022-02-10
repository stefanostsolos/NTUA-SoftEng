const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const passescost = require('./../../../CLI/utils/passescost.js')

test('Unit Test for passescost function (case: correct input)', async () => {
    const res = await passescost.passescost(baseURL, jwt, 'AO', 'EG', '20210419', '20210619', 'csv');
    expect(res).toBe(200)
})

test('Unit Test for passescost function (case: invalid input)', async () => {
    const res = await passescost.passescost(baseURL, jwt, 'AE', 'EG', '20210419', '20210619', 'csv');
    expect(res).toBe(400)
})

test('Unit Test for passescost function (case: not authorized user)', async () => {
    const res = await passescost.passescost(baseURL, false_jwt, 'AO', 'EG', '20210419', '20210619', 'csv');
    expect(res).toBe(401)
})