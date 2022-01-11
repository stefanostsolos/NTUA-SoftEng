module.exports = { login: login };

const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs');

async function promptMissingUsr() {
    const question = [];

    question.push({
        type: 'input',
        name: 'username',
        message: 'Type your username',
    });

    const answer = await inquirer.prompt(question);
    return answer.username;
}

async function promptMissingPsw() {
    const question = [];

    question.push({
        type: 'input',
        name: 'password',
        message: 'Type your password',
    });

    const answer = await inquirer.prompt(question);
    return answer.password;
}

async function login(baseURL, usr, pswd) {

    if (usr == undefined) {
        console.log("Error: Username is missing");
        usr = await promptMissingUsr();
    }
    if (pswd == undefined) {
        console.log("Error: Password is missing");
        pswd = await promptMissingPsw();
    }

    axios.post(`${baseURL}/login`, `username=${usr}&password=${pswd}`
    ).then((response) => {
        fs.writeFile('./bin/token.txt', response.data.token, 'utf8', function (err) {
            if (err) console.log(err)
        });
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: login");
    });
}