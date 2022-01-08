module.exports = { switch_fun: switch_fun };

function switch_fun(fun, options) {
    let code = -400;
    let utils;
    switch (fun) {
        case 'healthcheck':
            utils = path(fun);
            code = utils.healthcheck();
            break;
        case 'resetpasses':
            utils = path(fun);
            code = utils.resetpasses();
            break;
        case 'resetstations':
            utils = path(fun);
            code = utils.resetstations();
            break;
        case 'resetvehicles':
            utils = path(fun);
            code = utils.resetvehicles();
            break;
        case 'resettags':
            utils = path(fun);
            code = utils.resettags();
            break;
        case 'resetadmin':
            utils = path(fun);
            code = utils.resetadmin();
            break; 
        case 'login':
            utils = path(fun);
            code = utils.login(options.username, options.passw);
            break;
        case 'logout':
            utils = path(fun);
            code = utils.logout();
            break;
        case 'passesperstation':
            utils = path(fun);
            code = utils.passesperstation(options.station, options.datefrom, options.dateto);
            break;
        case 'passesanalysis':
            utils = path(fun);
            code = utils.passesanalysis(options.op1, options.op2, options.datefrom, options.dateto);
            break;
        case 'passescost':
            utils = path(fun);
            code = utils.passescost(options.op1, options.op2, options.datefrom, options.dateto);
            break;
        case 'chargesby':
            utils = path(fun);
            code = utils.chargesby(options.op, options.datefrom, options.dateto);
            break;
        case 'users':
            utils = path(fun);
            code = utils.users();
            break;
        case 'userdata':
            utils = path(fun);
            code = utils.userdata(options.username);
            break;
        case 'newsettlement':
            utils = path(fun);
            code = utils.newsettlement(options.op1, options.op2, options.dateto);
            break;
        case 'settlementbyid':
            utils = path(fun);
            code = utils.settlementbyid(options.id);
            break;
        case 'settlementbyoperator':
            utils = path(fun);
            code = utils.settlementbyoperator(options.opid);
            break;
        case 'clearsettlement':
            utils = path(fun);
            code = utils.clearsettlement(options.id);
            break;
        default:
            console.log("Error: Wrong scope input");
            break;
    }
    return code;
}

function path(fun) {
    let utils = require(`./../utils/${fun}`);
    return utils;
}
