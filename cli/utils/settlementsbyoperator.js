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

async function promptMissingFormat() {
    const question = [];

    question.push({
        type: 'list',
        name: 'format',
        message: 'Choose your answers format',
        choices: ['json', 'csv'],
    });

    const answer = await inquirer.prompt(question);
    return answer.format;
}

async function settlementsbyoperator(baseURL, token, op1, format) {
    let res;

    if (op1 == undefined) {
        console.log("Operator is missing");
        op1 = await promptMissingOperator();
    }
    if (format == undefined) {
        console.log("format is missing");
        format = await promptMissingFormat();
    }

    await axios.get(`${baseURL}/SettlementsByOperator/${op1}?format=${format}`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: SettlementsByOperator");
        res = error.response.status;
    });

    return res;
}
