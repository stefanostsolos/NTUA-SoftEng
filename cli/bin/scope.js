

module.exports = { scope: scope }

const inquirer = require("inquirer");

async function promptMissingScope() {
    const question = [];

    question.push({
        type: 'list',
        name: 'scope',
        message: 'Please choose which scope you want',
        choices: ['healthcheck: check end-to-end connectivity (between user and database)',
            'resetpasses',
            'resetstations',
            'resetvehicles',
            'resettags',
            'resetadmin',
            'passesupd',
            'usermod',
            'login: post user login credentials (inputted by user in the login form) and perform identification',
            'logout: perform user logout',
            'getoperatorids',
            'getstationids',
            'passesperstation',
            'passesanalysis',
            'passescost',
            'chargesby',
            'users',
            'userdata',
            'newsettlement',
            'settlementbyid',
            'settlementbyoperator',
            'clearsettlement'],
    });

    const answer = await inquirer.prompt(question);
    let [res, ...tail] = answer.scope.split(":");
    return res;
}

async function scope(arg) {
    let scope = arg
    if (scope == undefined) scope = await promptMissingScope();
    return scope;
}
