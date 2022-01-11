module.exports = { clearsettlement: clearsettlement };

const inquirer = require('inquirer');
const axios = require('axios');

async function promptMissingID() {
    const question = [];

    question.push({
        type: 'input',
        name: 'id',
        message: 'Please type an id',
    });

    const answer = await inquirer.prompt(question);
    return answer.id;
}

async function clearsettlement(baseURL, token, id,) {

    if (id == undefined) {
        console.log("Error: ID is missing");
        dateto = await promptMissingID();
    }

    axios.post(`${baseURL}/ClearSettlement/${id}`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: ClearSettlement");
    });
}