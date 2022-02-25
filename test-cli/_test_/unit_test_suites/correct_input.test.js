const baseURL = 'http://localhost:9103/interoperability/api';
const login = require(`${__dirname}/../../../cli/utils/login.js`)
const chargesby = require(`${__dirname}/../../../cli/utils/chargesby.js`)
const clearsettlement = require(`${__dirname}/../../../cli/utils/clearsettlement.js`)
const getoperatorIDs = require(`${__dirname}/../../../cli/utils/getoperatorIDs.js`)
const getstationIDs = require(`${__dirname}/../../../cli/utils/getstationIDs.js`)
const healthcheck = require(`${__dirname}/../../../cli/admin/healthcheck.js`)
const passesanalysis = require(`${__dirname}/../../../cli/utils/passesanalysis.js`)
const passescost = require(`${__dirname}/../../../cli/utils/passescost.js`)
const passesperstation = require(`${__dirname}/../../../cli/utils/passesperstation.js`)
const settlementbyid = require(`${__dirname}/../../../cli/utils/settlementbyid.js`)
const settlementsbyoperator = require(`${__dirname}/../../../cli/utils/settlementsbyoperator.js`)
const passesupd = require(`${__dirname}/../../../cli/admin/admin_utils/passesupd.js`)
const usermod = require(`${__dirname}/../../../cli/admin/admin_utils/usermod.js`)
const users = require(`${__dirname}/../../../cli/admin/admin_utils/users.js`)
const logout = require(`${__dirname}/../../../cli/utils/logout.js`)
const resetpasses = require(`${__dirname}/../../../cli/admin/resetpasses.js`)
const resetstations = require(`${__dirname}/../../../cli/admin/resetstations.js`)
const resettags = require(`${__dirname}/../../../cli/admin/resettags.js`)
const resetvehicles = require(`${__dirname}/../../../cli/admin/resetvehicles.js`)


test('Unit Test for login function (case: correct input)', async () => {
    const res = await login.login(baseURL, 'admin', 'freepasses4all');
    expect(res).toBe(200)
})

test('Unit Test for chargesby function (casae: correct input)', async () => {
    const res = await chargesby.chargesby(baseURL, 'AO', '20210419', '20210619', 'json');
    expect(res).toBe(200)
})

test('Unit Test for clearsettlement function (case: correct input)', async () => {
    const res = await clearsettlement.clearsettlement(baseURL, '2LCQALYTFG');
    expect(res).toBe(200)
})

test('Unit Test for getoperatorIDs function (case: correct input)', async () => {
    const res = await getoperatorIDs.getoperatorIDs(baseURL);
    expect(res).toBe(200)
})

test('Unit Test for getstationIDs function (case: correct input)', async () => {
    const res = await getstationIDs.getstationIDs(baseURL);
    expect(res).toBe(200)
})

test('Unit Test for Healthcheck function', async () => {
    const res = await healthcheck.healthcheck(baseURL);
    expect(res).toBe(200)
})

test('Unit Test for passesanalysis function (case: correct input)', async () => {
    const res = await passesanalysis.passesanalysis(baseURL, 'AO', 'EG', '20210419', '20210619', 'csv');
    expect(res).toBe(200)
})

test('Unit Test for passescost function (case: correct input)', async () => {
    const res = await passescost.passescost(baseURL, 'AO', 'EG', '20210419', '20210619', 'csv');
    expect(res).toBe(200)
})

test('Unit Test for passesperstation function (case: correct input)', async () => {
    const res = await passesperstation.passesperstation(baseURL, 'AO11', '20210419', '20210619', 'json');
    expect(res).toBe(200)
})

test('Unit Test for settlementbyid function (case: correct input)', async () => {
    const res = await settlementbyid.settlementbyid(baseURL, '2LCQALYTFG', 'json');
    expect(res).toBe(200)
})

test('Unit Test for settlementsbyoperator function (case: correct input)', async () => {
    const res = await settlementsbyoperator.settlementsbyoperator(baseURL, 'EG', 'json');
    expect(res).toBe(200)
})

test('Unit Test for passesupd function (case: correct input)', async () => {
    const res = await passesupd.passesupd(baseURL, `${__dirname}/../sample_imports.csv`);
    expect(res).toBe(200);
})

test('Unit Test for usermod function (case: correct input)', async () => {
    const res = await usermod.usermod(baseURL, 'new_user', '123456789', 'operator', 'AO');
    expect(res).toBe(200);
})

test('Unit Test for users function (case: correct input)', async () => {
    const res = await users.users(baseURL);
    expect(res).toBe(200);
})

test('Unit Test for users function with input (case: correct input)', async () => {
    const res = await users.users(baseURL, 'admin');
    expect(res).toBe(200);
})

test('Unit Test for logout function (case: correct input)', async () => {
    const res = await logout.logout(baseURL);
    expect(res).toBe(200)
})

test('Unit Test for login function (case: correct input)', async () => {
    const res = await login.login(baseURL, 'admin', 'freepasses4all');
    expect(res).toBe(200)
})

test('Unit Test for resetstations function (case: correct input)', async () => {
    const res = await resetstations.resetstations(baseURL);
    expect(res).toBe(200)
})

test('Unit Test for resetvehicles function (case: correct input)', async () => {
    const res = await resetvehicles.resetvehicles(baseURL);
    expect(res).toBe(200)
})

test('Unit Test for resettags function (case: correct input)', async () => {
    const res = await resettags.resettags(baseURL);
    expect(res).toBe(200)
})

test('Unit Test for resetpasses function (case: correct input)', async () => {
    const res = await resetpasses.resetpasses(baseURL);
    expect(res).toBe(200)
}, 20000)