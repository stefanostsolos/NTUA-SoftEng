module.exports = { usermod : usermod };

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
        message: 'Please choose a username',
    });

    const answer = await inquirer.prompt(question);
    return answer.username;
}

async function promptMissingPassword() {
    const question = [];

    question.push({
        type: 'input',
        name: 'password',
        message: 'Please choose a password',
    });

    const answer = await inquirer.prompt(question);
    return answer.password;
}

async function promptMissingType() {
    const question = [];

    question.push({
        type: 'input',
        name: 'type',
        message: 'Please choose a type',
    });

    const answer = await inquirer.prompt(question);
    return answer.type;
}

async function promptMissingOpID() {
    const question = [];

    question.push({
        type: 'input',
        name: 'opID',
        message: 'Please choose an operatorID',
    });

    const answer = await inquirer.prompt(question);
    return answer.opID;
}

async function usermod(username, password, type, opID) {        
    console.log(usage + "Creates a new settlement record in the database for the debts between the two given operators. The settlement accounts for the debts created between the last settlement date and the provided date. This resource may be accessed by any operator user whose ID matches either of the operator IDs in the request, as well as by any admin user.");
    
    if (username == undefined) { 
        console.log("Error: username is missing");
        station = await promptMissingUsername();
    }

    if (password == undefined) { 
        console.log("Error: password is missing");
        station = await promptMissingPassword();
    }

    if (type == undefined) {
        console.log("Error: type is missing");
        dateto = await promptMissingType();
    }
    
    if (opID == undefined) {
        console.log("Error: operatorID is missing");
        dateto = await promptMissingOpID();
    }

    const res = await axios.post(`${baseURL}/admin/usermod`, { username: username, password: password, type: type, operatorID: opID })

    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: usermod");
        return [res.status];
    }
    console.log(res.data);
}
