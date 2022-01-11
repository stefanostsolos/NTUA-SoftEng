module.exports = { admin: admin };

const admin_scope = require('./admin_scope.js');

async function admin(baseURL, token, options) {
    let fun;
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
            utils.usermod(baseURL, token, options.username, options.passw, options.type, options.operatorID);
            break;
        case 'passesupd':
            utils = path(fun);
            utils.passesupd(baseURL, token, options.source);
            break;
        case 'users':
            utils = path(fun);
            utils.users(baseURL, token, options.username);
            break;
        default:
            console.log("Error 400: Bad request");
            console.log("Found at: Admin");
            break;
    }
}

function path(fun) {
    let utils = require(`./admin_utils/${fun}`);
    return utils;
}
