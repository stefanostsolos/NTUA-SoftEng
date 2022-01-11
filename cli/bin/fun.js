module.exports = { switch_fun: switch_fun };

const baseURL = 'http://localhost:9103/interoperability/api';
const axios = require('axios');
const jwt = require('./jwt.js');

function switch_fun(fun, options) {
    const token = jwt.validate();
    let utils, admin;

    switch (fun) {
        case 'healthcheck':
            admin = admin_path(fun);
            admin.healthcheck(baseURL);
            break;
        case 'resetpasses':
            admin = admin_path(fun);
            admin.resetpasses(baseURL, token);
            break;
        case 'resetstations':
            admin = admin_path(fun);
            admin.resetstations(baseURL, token);
            break;
        case 'resetvehicles':
            admin = admin_path(fun);
            admin.resetvehicles(baseURL, token);
            break;
        case 'resettags':
            admin = admin_path(fun);
            admin.resettags(baseURL, token);
            break;
        case 'admin':
            admin = admin_path(fun);
            admin.admin(baseURL, token, options);
            break;
        case 'login':
            utils = path(fun);
            utils.login(baseURL, options.username, options.passw);
            break;
        case 'logout':
            utils = path(fun);
            utils.logout(baseURL, token);
            break;
        case 'passesperstation':
            utils = path(fun);
            utils.passesperstation(baseURL, token, options.station, options.datefrom, options.dateto, options.format);
            break;
        case 'passesanalysis':
            utils = path(fun);
            utils.passesanalysis(baseURL, token, options.op1, options.op2, options.datefrom, options.dateto, options.format);
            break;
        case 'passescost':
            utils = path(fun);
            utils.passescost(baseURL, token, options.op1, options.op2, options.datefrom, options.dateto, options.format);
            break;
        case 'chargesby':
            utils = path(fun);
            utils.chargesby(baseURL, token, options.op1, options.datefrom, options.dateto, options.format);
            break;
        case 'getstationIDs':
            utils = path(fun);
            utils.getstationIDs(baseURL, token);
            break;
        case 'getoperatorIDs':
            utils = path(fun);
            utils.getoperatorIDs(baseURL, token);
            break;
        case 'newsettlement':
            utils = path(fun);
            utils.newsettlement(baseURL, token, options.op1, options.op2, options.dateto);
            break;
        case 'clearsettlement':
            utils = path(fun);
            utils.clearsettlement(baseURL, token, options.id);
            break;
        case 'settlementbyid':
            utils = path(fun);
            utils.settlementbyid(baseURL, token, options.id, options.format);
            break;    
        case 'settlementsbyoperator':
            utils = path(fun);
            utils.settlementsbyoperator(baseURL, token, options.op1, options.format);
            break;
        default:
            axios.get(`${baseURL}/${fun}`, {
                headers: {
                    'X-OBSERVATORY-AUTH': `${token}`
                }
            }).then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.log(`Error(${error.response.status}): ` + error.response.data);
                console.log("Found at: Scope");
            });
            break;
    }
}

function path(fun) {
    let utils = require(`./../utils/${fun}`);
    return utils;
}

function admin_path(fun) {
    let admin = require(`./../admin/${fun}`);
    return admin;
}