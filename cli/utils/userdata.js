module.exports = { userdata : userdata };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const https = require('https')
const axios = require('axios')
const inquirer = require('inquirer');
const usage = ("\nUsage: ");

axios.defaults.httpsAgent = new https.Agent()

async function promptMissingUsername() {
    const question = [];

    question.push({
        type: 'input',
        name: 'username',
        message: 'Please choose the username',
    });

    const answer = await inquirer.prompt(question);
    return answer.username;
}

async function userdata(username) {
    console.log(usage + "Get data of user with given username. Only admin users may access this resource.");

    if (username == undefined) { 
        console.log("Error: username is missing");
        station = await promptMissingUsername();
    }

    const res = await axios.get(`${baseURL}/admin/users/${username}`)

    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: userdata");
        return [res.status];
    }
    console.log(res.data);
}
