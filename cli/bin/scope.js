module.exports = { scope: scope }

const inquirer = require("inquirer");

async function promptMissingScope() {
    const question = [];

    question.push({
        type: 'list',
        name: 'scope',
        message: 'Please choose which scope you want',
        choices: [
            'admin',
            'login: User login credentials (inputted by user in the login form) and perform identification',
            'logout: Perform user logout',
            'healthcheck: Check end-to-end connectivity (between user and database)',
            'resetpasses: Deletes all pass records from the database and resets the administrator account to default',
            'resetstations: Resets the station records in the database to default',
            'resettags: Resets the tag records in the database to default',
            'resetvehicles: Resets the vehicle records in the database to default',
            'passesperstation: Fetch a list of passes that were recorded between specified dates',
            'passesanalysis: Fetch a list of passes that were recorded between specified dates',
            'passescost: Fetch the number of passes that were recorded between specified dates',
            'chargesby: Fetch the number of passes that were recorded between specified dates',
            'getstationIDs: Fetch a list of all station IDs',
            'getoperatorIDs: Fetch a list of all operator IDs',
            'settlementbyid: Fetch a settlement record with the given ID',
            'newsettlement: Creates a new settlement record in the database for the debts between the two given operators',
            'settlementsbyoperator: Fetch a list of settlement records concerning the given operator',
            'clearsettlement: Mark an existing settlement record as cleared in the database'
        ],
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