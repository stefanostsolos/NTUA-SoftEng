module.exports = { settlementbyid: settlementbyid };

const inquirer = require("inquirer");
const axios = require('axios');

async function promptMissingID() {
    const question = [];

    question.push({
        type: 'input',
        name: 'id',
        message: 'Please type a settlement ID',
    });

    const answer = await inquirer.prompt(question);
    return answer.id;
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

async function settlementbyid(baseURL, token, id, format) {
    let res;

    if (id == undefined) {
        console.log("Error: settlement ID is missing");
        id = await promptMissingID();
    }
    if (format == undefined) {
        console.log("Error: format is missing");
        format = await promptMissingFormat();
    }

    await axios.get(`${baseURL}/SettlementByID/${id}?format=${format}`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: SettlementByID");
        res = error.response.status;
    });

    return res;
}