module.exports = { switch_fun: switch_fun };

function switch_fun(fun, options) {
    let utils;
    switch (fun) {
        case 'healthcheck':
            utils = path(fun);
            utils.healthcheck();
            break;
        case 'resetpasses':
            utils = path(fun);
            utils.resetpasses();
            break;
        case 'resetstations':
            utils = path(fun);
            utils.resetstations();
            break;
        case 'resetvehicles':
            utils = path(fun);
            utils.resetvehicles();
            break;
        case 'login':
            utils = path(fun);
            utils.login(options.username, options.passw);
            break;
        case 'logout':
            utils = path(fun);
            utils.logout();
            break;
        case 'passesperstation':
            utils = path(fun);
            utils.passesperstation(options.station, options.datefrom, options.dateto, options.format);
            break;
        case 'passesanalysis':
            utils = path(fun);
            utils.passesanalysis(options.op1, options.op2, options.datefrom, options.dateto, options.format);
            break;
        case 'passescost':
            utils = path(fun);
            utils.passescost(options.op1, options.op2, options.datefrom, options.dateto, options.format);
            break;
        case 'chargesby':
            utils = path(fun);
            utils.chargesby(options.op, options.datefrom, options.dateto, options.format);
            break;
        default:
            console.log("Error 400: Bad request");
            console.log("Found at: Scope");
            break;
    }
}

function path(fun) {
    let utils = require(`./../utils/${fun}`);
    return utils;
}