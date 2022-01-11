module.exports = { settlementsbyoperator: settlementsbyoperator };

const inquirer = require("inquirer");
const axios = require('axios');

async function promptMissingOperator() {
    const question = [];

    question.push({
        type: 'input',
        name: 'operator',
        message: 'Please type an operator of your choice',
    });

    const answer = await inquirer.prompt(question);
    return answer.operator;
}

async function settlementsbyoperator(baseURL, token, op1, format) {
    if (op1 == undefined) {
        console.log("Error: operator one is missing");
        op1 = await promptMissingOperator();
    }

    axios.get(`${baseURL}/SettlementsByOperator/${op1}?format=${format}`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: SettlementsByOperator");
    });
}