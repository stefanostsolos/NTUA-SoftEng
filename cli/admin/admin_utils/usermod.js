module.exports = { usermod: usermod };

const inquirer = require('inquirer');
const axios = require('axios');

async function promptMissingUsername() {
    const question = [];

    question.push({
        type: 'input',
        name: 'username',
        message: 'Please type a username',
    });

    const answer = await inquirer.prompt(question);
    return answer.username;
}

async function promptMissingPassw() {
    const question = [];

    question.push({
        type: 'input',
        name: 'passw',
        message: 'Please type a passw',
    });

    const answer = await inquirer.prompt(question);
    return answer.passw;
}

async function promptMissingType() {
    const question = [];

    question.push({
        type: 'input',
        name: 'type',
        message: 'Please type a type',
    });

    const answer = await inquirer.prompt(question);
    return answer.type;
}

async function promptMissingOperatorID() {
    const question = [];

    question.push({
        type: 'input',
        name: 'operatorID',
        message: 'Please type an operatorID',
    });

    const answer = await inquirer.prompt(question);
    return answer.operatorID;
}

async function usermod(baseURL, token, username, passw, type, operatorID) {

    if (username == undefined) {
        console.log("Error: username one is missing");
        username = await promptMissingUsername();
    }
    if (passw == undefined) {
        console.log("Error: username one is missing");
        passw = await promptMissingPassw();
    }
    if (type == undefined) {
        console.log("Error: username one is missing");
        type = await promptMissingType();
    }
    if (operatorID == undefined) {
        if (username == 'admin') operatorID = null;
        else {
            console.log("Error: username one is missing");
            operatorID = await promptMissingOperatorID();
        }
    }

    axios.post(`${baseURL}/admin/usermod`, `username=${username}&passw=${passw}&type=${type}&operatorID=${operatorID}`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`,
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: usermod");
    });
}
