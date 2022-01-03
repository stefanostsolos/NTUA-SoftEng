module.exports = { chargesby: chargesby };

const inquirer = require("inquirer");
const axios = require('axios');
const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';

async function promptMissingOperator() {
    const question = [];

    question.push({
        type: 'input',
        name: 'operator',
        message: 'Please type an operator of your choice',
    });

    const answer = await inquirer.prompt(question);
    return answer.station;
}

async function promptMissingDateFrom() {
    const question = [];

    question.push({
        type: 'input',
        name: 'DateFrom',
        message: 'Type a starting Date(YYYYMMDD)',
    });

    const answer = await inquirer.prompt(question);
    return answer.DateFrom;
}

async function promptMissingDateTo() {
    const question = [];

    question.push({
        type: 'input',
        name: 'DateTo',
        message: 'Type a last Date(YYYYMMDD)',
    });

    const answer = await inquirer.prompt(question);
    return answer.DateTo;
}

async function chargesby(op, datefrom, dateto, format) {
    if (op == undefined) {
        console.log("Error: operator one is missing");
        op = await promptMissingOperator();
    }
    if (datefrom == undefined) {
        console.log("Error: datefrom is missing");
        datefrom = await promptMissingDateFrom();
    }
    if (dateto == undefined) {
        console.log("Error: datefrom is missing");
        dateto = await promptMissingDateTo();
    }

    const res = await axios.get(`${baseURL}/ChargesBy/${op}/${datefrom}/${dateto}?format=${format}`);
    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: chargesby");
        return [res.status];
    }
    console.log(res.data);

}