module.exports = { switch_fun: switch_fun };

const baseURL = 'http://localhost:9103/interoperability/api';
const axios = require('axios');
const jwt = require('./jwt.js')

async function switch_fun(fun, options) {
    const token = jwt.validate();
    let utils, admin, res;

    switch (fun) {
        case 'healthcheck':
            admin = admin_path(fun);
            res = await admin.healthcheck(baseURL);
            break;
        case 'resetpasses':
            admin = admin_path(fun);
            res = await admin.resetpasses(baseURL);
            break;
        case 'resetstations':
            admin = admin_path(fun);
            res = await admin.resetstations(baseURL);
            break;
        case 'resetvehicles':
            admin = admin_path(fun);
            res = await admin.resetvehicles(baseURL);
            break;
        case 'resettags':
            admin = admin_path(fun);
            res = await admin.resettags(baseURL);
            break;
        case 'admin':
            admin = admin_path(fun);
            res = await admin.admin(baseURL, options);
            break;
        case 'login':
            utils = path(fun);
            res = await utils.login(baseURL, options.username, options.passw);
            break;
        case 'logout':
            utils = path(fun);
            res = await utils.logout(baseURL);
            break;
        case 'passesperstation':
            utils = path(fun);
            res = await utils.passesperstation(baseURL, options.station, options.datefrom, options.dateto, options.format);
            break;
        case 'passesanalysis':
            utils = path(fun);
            res = await utils.passesanalysis(baseURL, options.op1, options.op2, options.datefrom, options.dateto, options.format);
            break;
        case 'passescost':
            utils = path(fun);
            res = await utils.passescost(baseURL, options.op1, options.op2, options.datefrom, options.dateto, options.format);
            break;
        case 'chargesby':
            utils = path(fun);
            res = await utils.chargesby(baseURL, options.op1, options.datefrom, options.dateto, options.format);
            break;
        case 'getstationIDs':
            utils = path(fun);
            res = await utils.getstationIDs(baseURL);
            break;
        case 'getoperatorIDs':
            utils = path(fun);
            res = await utils.getoperatorIDs(baseURL);
            break;
        case 'newsettlement':
            utils = path(fun);
            res = await utils.newsettlement(baseURL, options.op1, options.op2, options.dateto);
            break;
        case 'clearsettlement':
            utils = path(fun);
            res = await utils.clearsettlement(baseURL, options.id);
            break;
        case 'settlementbyid':
            utils = path(fun);
            res = await utils.settlementbyid(baseURL, options.id, options.format);
            break;
        case 'settlementsbyoperator':
            utils = path(fun);
            res = await utils.settlementsbyoperator(baseURL, options.op1, options.format);
            break;
        default:
            await axios.get(`${baseURL}/${fun}`, {
                headers: {
                    'X-OBSERVATORY-AUTH': `${token}`
                }
            }).then((response) => {
                console.log(response.data);
                res = response.status;
            }).catch((error) => {
                console.log(`Error(${error.response.status}): ` + error.response.data);
                console.log("Found at: Scope");
                res = error.response.status;
            });
            break;
    }
    return res;
}

function path(fun) {
    let utils = require(`./../utils/${fun}`);
    return utils;
}

function admin_path(fun) {
    let admin = require(`./../admin/${fun}`);
    return admin;
}