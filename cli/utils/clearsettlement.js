module.exports = { clearsettlement : clearsettlement };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const https = require('https')
const axios = require('axios')
const inquirer = require('inquirer');
const usage = ("\nUsage: ");

axios.defaults.httpsAgent = new https.Agent()

async function promptMissingID() {
    const question = [];

    question.push({
        type: 'input',
        name: 'id',
        message: 'Please choose the id',
    });

    const answer = await inquirer.prompt(question);
    return answer.id;
}

async function clearsettlement(id) {        
    console.log(usage + "Mark an existing settlement record as cleared in the database. This resource may be accessed by any payment or admin user.");

    if (id == undefined) { 
        console.log("Error: id is missing");
        station = await promptMissingID();
    }

    const res = await axios.post(`${baseURL}/ClearSettlement/${id}?format=${format}`)

    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: clearsettlement");
        return [res.status];
    }
    console.log(res.data);
}
