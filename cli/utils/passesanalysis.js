module.exports = { passesanalysis: passesanalysis };

const inquirer = require("inquirer");
const axios = require('axios');
const jwt = require(`${__dirname}/../bin/jwt.js`);

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

async function promptMissingDateFrom() {
    const question = [];

    question.push({
        type: 'input',
        name: 'DateFrom',
        message: 'Type the earliest date of pass records to be fetched in YYYYMMDD format',
    });

    const answer = await inquirer.prompt(question);
    return answer.DateFrom;
}

async function promptMissingDateTo() {
    const question = [];

    question.push({
        type: 'input',
        name: 'DateTo',
        message: 'The latest date of pass records to be fetched in YYYYMMDD format',
    });

    const answer = await inquirer.prompt(question);
    return answer.DateTo;
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

async function passesanalysis(baseURL, op1, op2, datefrom, dateto, format) {
    const token = jwt.validate();
    let res;

    if (op1 == undefined) {
        console.log("Error: operator one is missing");
        op1 = await promptMissingOperator();
    }
    if (op2 == undefined) {
        console.log("Error: operator two is missing");
        op2 = await promptMissingOperator();
    }
    if (datefrom == undefined) {
        console.log("Error: datefrom is missing");
        datefrom = await promptMissingDateFrom();
    }
    if (dateto == undefined) {
        console.log("Error: datefrom is missing");
        dateto = await promptMissingDateTo();
    }
    if (format == undefined) {
        console.log("Error: format is missing");
        format = await promptMissingFormat();
    }

    await axios.get(`${baseURL}/PassesAnalysis/${op1}/${op2}/${datefrom}/${dateto}?format=${format}`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: PassesAnalysis");
        res = error.response.status;
    });

    return res;
}