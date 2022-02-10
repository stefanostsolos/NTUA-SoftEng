const baseURL = 'http://localhost:9103/interoperability/api';
const token_path = require('./../../../CLI/bin/jwt.js')
const jwt = token_path.validate();
const false_jwt = jwt + '1';
const passesperstation = require('./../../../CLI/utils/passesperstation.js')

test('Unit Test for passesperstation function (case: correct input)', async () => {
    const res = await passesperstation.passesperstation(baseURL, jwt, 'AO11', '20210419', '20210619', 'json');
    expect(res).toBe(200)
})

test('Unit Test for passesperstation function (case: invalid input)', async () => {
    const res = await passesperstation.passesperstation(baseURL, jwt, 'AO111', '20210419', '20210619', 'json');
    expect(res).toBe(400)
})

test('Unit Test for passesperstation function (case: not authorized user)', async () => {
    const res = await passesperstation.passesperstation(baseURL, false_jwt, 'AO11', '20210419', '20210619', 'json');
    expect(res).toBe(401)
})