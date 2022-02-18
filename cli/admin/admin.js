module.exports = { admin: admin };

const admin_scope = require('./admin_scope.js');

async function admin(baseURL, options) {
    let fun, res;
    for (let x in options) {
        if (x == '_') continue;
        fun = x;
        break;
    }
    if (fun == '$0') {
        fun = await admin_scope.promptMissingScope();
    }
    switch (fun) {
        case 'usermod':
            utils = path(fun);
            res = await utils.usermod(baseURL, options.username, options.passw, options.type, options.operatorID);
            break;
        case 'passesupd':
            utils = path(fun);
            res = await utils.passesupd(baseURL, options.source);
            break;
        case 'users':
            utils = path(fun);
            res = await utils.users(baseURL, options.username);
            break;
        default:
            console.log("Error 400: Bad request");
            console.log("Found at: Admin");
            res = 404;
            break;
    }

    return res;
}

function path(fun) {
    let utils = require(`./admin_utils/${fun}`);
    return utils;
}