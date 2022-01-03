module.exports = { login: login };

const inquirer = require('inquirer');
const axios = require('axios');
const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';

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

async function login(usr, pswd) {

    if (usr == undefined) {
        console.log("Error: Username is missing");
        usr = await promptMissingUsr();
    }
    if (pswd == undefined) {
        console.log("Error: Password is missing");
        pswd = await promptMissingPsw();
    }
    const res = await axios.post(`${baseURL}/login`, { username: `${usr}`, password: `${pswd}` });
    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: login");
        return [res.status];
    }
    else return [res.status, false, res.data];
}