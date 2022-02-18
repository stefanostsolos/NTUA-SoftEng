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
const passesupd = require(`${__dirname}/../../../cli/admin/admin_utils/passesupd.js`)
const usermod = require(`${__dirname}/../../../cli/admin/admin_utils/usermod.js`)
const users = require(`${__dirname}/../../../cli/admin/admin_utils/users.js`)

test('Unit Test for login function (case: invalid username)', async () => {
    const res = await login.login(baseURL, 'not valid', '123456789');
    expect(res).toBe(400)
})

test('Unit Test for chargesby function (case: invalid input)', async () => {
    const res = await chargesby.chargesby(baseURL, 'AE', '20210419', '20210619', 'json');
    expect(res).toBe(400)
})

test('Unit Test for clearsettlement function (case: invalid input)', async () => {
    const res = await clearsettlement.clearsettlement(baseURL, 'wrond_id');
    expect(res).toBe(400)
})

test('Unit Test for newsettlement function', async () => {
    const res = await newsettlement.newsettlement(baseURL, 'not_valid', 'AO', '20210919');
    expect(res).toBe(400)
})

test('Unit Test for passesanalysis function (case: invalid input)', async () => {
    const res = await passesanalysis.passesanalysis(baseURL, 'AE', 'EG', '20210419', '20210619', 'csv');
    expect(res).toBe(400)
})

test('Unit Test for passescost function (case: invalid input)', async () => {
    const res = await passescost.passescost(baseURL, 'AE', 'EG', '20210419', '20210619', 'csv');
    expect(res).toBe(400)
})

test('Unit Test for passesperstation function (case: invalid input)', async () => {
    const res = await passesperstation.passesperstation(baseURL, 'AO111', '20210419', '20210619', 'json');
    expect(res).toBe(400)
})

test('Unit Test for settlementbyid function (case: invalid input)', async () => {
    const res = await settlementbyid.settlementbyid(baseURL, '8X01WHCZ11', 'invalid format');
    expect(res).toBe(400)
})

test('Unit Test for settlementsbyoperator function (case: invalid input)', async () => {
    const res = await settlementsbyoperator.settlementsbyoperator(baseURL, 'Invalid input', 'json');
    expect(res).toBe(400)
})

test('Unit Test for passesupd function (case: invalid input)', async () => {
    const res = await passesupd.passesupd(baseURL, 'not_valid');
    expect(res).toBe(404);
})

test('Unit Test for usermod function (case: invalid input)', async () => {
    const res = await usermod.usermod(baseURL, 'new_user', '123456789', 'not valid', 'not valid');
    expect(res).toBe(400);
})

test('Unit Test for users function (case: wrong input)', async () => {
    const res = await users.users(baseURL, 'not valid');
    expect(res).toBe(400);
})