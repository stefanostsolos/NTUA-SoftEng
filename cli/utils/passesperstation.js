module.exports = { passesperstation: passesperstation };

const inquirer = require("inquirer");
const axios = require('axios');
const jwt = require(`${__dirname}/../bin/jwt.js`);

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
        message: 'Type the latest date of pass records to be fetched in YYYYMMDD format',
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

async function passesperstation(baseURL, station, datefrom, dateto, format) {
    const token = jwt.validate();
    let res;

    if (station == undefined) {
        console.log("station is missing");
        station = await promptMissingStation();
    }
    if (datefrom == undefined) {
        console.log("datefrom is missing");
        datefrom = await promptMissingDateFrom();
    }
    if (dateto == undefined) {
        console.log("dateto is missing");
        dateto = await promptMissingDateTo();
    }
    if (format == undefined) {
        console.log("format is missing");
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
