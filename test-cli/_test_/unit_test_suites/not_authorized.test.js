const baseURL = 'http://localhost:9103/interoperability/api';
const login = require(`${__dirname}/../../../cli/utils/login.js`)
const chargesby = require(`${__dirname}/../../../cli/utils/chargesby.js`)
const clearsettlement = require(`${__dirname}/../../../cli/utils/clearsettlement.js`)
const getoperatorIDs = require(`${__dirname}/../../../cli/utils/getoperatorIDs.js`)
const getstationIDs = require(`${__dirname}/../../../cli/utils/getstationIDs.js`)
const healthcheck = require(`${__dirname}/../../../cli/admin/healthcheck.js`)
const newsettlement = require(`${__dirname}/../../../cli/utils/newsettlement.js`)
const passesanalysis = require(`${__dirname}/../../../cli/utils/passesanalysis.js`)
const passescost = require(`${__dirname}/../../../cli/utils/passescost.js`)
const passesperstation = require(`${__dirname}/../../../cli/utils/passesperstation.js`)
const settlementbyid = require(`${__dirname}/../../../cli/utils/settlementbyid.js`)
const settlementsbyoperator = require(`${__dirname}/../../../cli/utils/settlementsbyoperator.js`)
const usermod = require(`${__dirname}/../../../cli/admin/admin_utils/usermod.js`)
const users = require(`${__dirname}/../../../cli/admin/admin_utils/users.js`)
const logout = require(`${__dirname}/../../../cli/utils/logout.js`)

test('Unit Test for logout function (case: correct input)', async () => {
    const res = await logout.logout(baseURL);
    expect(res).toBe(200)
})

test('Unit Test for login function (case: invalid password)', async () => {
    const res = await login.login(baseURL, 'admin', 'notvalid');
    expect(res).toBe(401)
})

test('Unit Test for chargesby function (case: not authorized user)', async () => {
    const res = await chargesby.chargesby(baseURL, 'AO', '20210419', '20210619', 'json');
    expect(res).toBe(401)
})

test('Unit Test for clearsettlement function (case: not authorized user)', async () => {
    const res = await clearsettlement.clearsettlement(baseURL, 'WGSI08TUQL');
    expect(res).toBe(401)
})

test('Unit Test for getoperatorIDs function (case: not authorized user)', async () => {
    const res = await getoperatorIDs.getoperatorIDs(baseURL);
    expect(res).toBe(401)
})

test('Unit Test for getstationIDs function (case: not authorized user)', async () => {
    const res = await getstationIDs.getstationIDs(baseURL);
    expect(res).toBe(401)
})

test('Unit Test for newsettlement function', async () => {
    const res = await newsettlement.newsettlement(baseURL, 'EG', 'AO', '20210919');
    expect(res).toBe(401)
})

test('Unit Test for passesanalysis function (case: not authorized user)', async () => {
    const res = await passesanalysis.passesanalysis(baseURL, 'AO', 'EG', '20210419', '20210619', 'csv');
    expect(res).toBe(401)
})

test('Unit Test for passescost function (case: not authorized user)', async () => {
    const res = await passescost.passescost(baseURL, 'AO', 'EG', '20210419', '20210619', 'csv');
    expect(res).toBe(401)
})

test('Unit Test for passesperstation function (case: not authorized user)', async () => {
    const res = await passesperstation.passesperstation(baseURL, 'AO11', '20210419', '20210619', 'json');
    expect(res).toBe(401)
})

test('Unit Test for settlementbyid function (case: not authorized user)', async () => {
    const res = await settlementbyid.settlementbyid(baseURL, '8X01WHCZ11', 'json');
    expect(res).toBe(401)
})

test('Unit Test for settlementsbyoperator function (case: not authorized user)', async () => {
    const res = await settlementsbyoperator.settlementsbyoperator(baseURL, 'EG', 'json');
    expect(res).toBe(401)
})

test('Unit Test for usermod function (case: not authorized user)', async () => {
    const res = await usermod.usermod(baseURL, 'new_user', '123456789', 'operator', 'AO');
    expect(res).toBe(401);
})

test('Unit Test for users function (case: not authorized user)', async () => {
    const res = await users.users(baseURL);
    expect(res).toBe(401);
})

test('Unit Test for users function with input (case: not authorized user)', async () => {
    const res = await users.users(baseURL, 'admin');
    expect(res).toBe(401);
})

test('Unit Test for logout function (case: not authorized user)', async () => {
    const res = await logout.logout(baseURL);
    expect(res).toBe(401)
})