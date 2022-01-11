module.exports = { promptMissingScope: promptMissingScope }

const inquirer = require("inquirer");

async function promptMissingScope() {
    const question = [];

    question.push({
        type: 'list',
        name: 'scope',
        message: 'Please choose which admin scope you want',
        choices: [
            'usermod: Add new user or change attributes of existing user',
            'users: Get data of all users',
            'passesupd: Post a CSV file containing any number of pass records, one per row. Any uploaded records not already in the database will be inserted into it'
        ],
    });

    const answer = await inquirer.prompt(question);
    let [res, ...tail] = answer.scope.split(":");
    return res;
}