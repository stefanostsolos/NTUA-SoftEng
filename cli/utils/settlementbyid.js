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

async function settlementbyid(baseURL, token, id, format) {
    if (id == undefined) {
        console.log("Error: settlement ID is missing");
        id = await promptMissingID();
    }

    axios.get(`${baseURL}/SettlementByID/${id}?format=${format}`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: SettlementByID");
    });
}