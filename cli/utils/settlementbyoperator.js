module.exports = { settlementbyoperator : settlementbyoperator };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const https = require('https')
const axios = require('axios')
const inquirer = require('inquirer');
const usage = ("\nUsage: ");

axios.defaults.httpsAgent = new https.Agent()

async function promptMissingOp() {
    const question = [];

    question.push({
        type: 'input',
        name: 'opid',
        message: 'Please choose the operator',
    });

    const answer = await inquirer.prompt(question);
    return answer.opid;
}

async function settlementbyoperator(opid) {
    console.log(usage + "Fetch a list of settlement records concerning the given operator. This resource may be accessed by any operator user whose ID matches the operator ID in the request and by any admin user.");
   
    if (opid == undefined) { 
        console.log("Error: operator is missing");
        station = await promptMissingOp();
    }

    const res = await axios.get(`${baseURL}/SettlementByOperator/${opid}?format=${format}`)

    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: settlementbyoperator");
        return [res.status];
    }
    console.log(res.data);
}
