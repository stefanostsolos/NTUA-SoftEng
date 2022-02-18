module.exports = { clearsettlement: clearsettlement };

const inquirer = require('inquirer');
const axios = require('axios');
const jwt = require(`${__dirname}/../bin/jwt.js`);

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

async function clearsettlement(baseURL, id) {
    const token = jwt.validate();
    let res;

    if (id == undefined) {
        console.log("Error: ID is missing");
        id = await promptMissingID();
    }

    await axios.post(`${baseURL}/ClearSettlement`, { ID: `${id}` }, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: ClearSettlement");
        res = error.response.status;
    });

    return res;
}