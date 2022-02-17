module.exports = { passesperstation: passesperstation };

const inquirer = require("inquirer");
const axios = require('axios');

async function promptMissingStation() {
    const question = [];

    question.push({
        type: 'input',
        name: 'station',
        message: 'Please type a station'
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

async function passesperstation(baseURL, token, station, datefrom, dateto, format) {
    let res;

    if (station == undefined) {
        console.log("Error: station is missing");
        station = await promptMissingStation();
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

    await axios.get(`${baseURL}/PassesPerStation/${station}/${datefrom}/${dateto}?format=${format}`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: PassesPerStation");
        res = error.response.status;
    });

    return res;
}