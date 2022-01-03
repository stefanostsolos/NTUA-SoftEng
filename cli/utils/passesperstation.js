module.exports = { passesperstation: passesperstation };

const inquirer = require("inquirer");
const axios = require('axios');
const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';

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

async function passesperstation(station, datefrom, dateto, format) {

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

    const res = await axios.get(`${baseURL}/PassesPerStation/${station}/${datefrom}/${dateto}?format=${format}`);
    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: passesperstation");
        return [res.status];
    }
    console.log(res.data);
}