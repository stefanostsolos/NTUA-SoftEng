module.exports = { newsettlement : newsettlement };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const https = require('https')
const axios = require('axios')
const inquirer = require('inquirer');
const usage = ("\nUsage: ");

axios.defaults.httpsAgent = new https.Agent()

async function promptMissingOp1() {
    const question = [];

    question.push({
        type: 'input',
        name: 'op1',
        message: 'Please choose the 1st operator',
    });

    const answer = await inquirer.prompt(question);
    return answer.op1;
}

async function promptMissingOp2() {
    const question = [];

    question.push({
        type: 'input',
        name: 'op2',
        message: 'Please choose the 2nd operator',
    });

    const answer = await inquirer.prompt(question);
    return answer.op2;
}

async function promptMissingDateTo() {
    const question = [];

    question.push({
        type: 'input',
        name: 'dateto',
        message: 'Type a last Date',
    });

    const answer = await inquirer.prompt(question);
    return answer.dateto;
}

async function newsettlement(op1, op2, dateto) {        
    console.log(usage + "Creates a new settlement record in the database for the debts between the two given operators. The settlement accounts for the debts created between the last settlement date and the provided date. This resource may be accessed by any operator user whose ID matches either of the operator IDs in the request, as well as by any admin user.");
    
    if (op1 == undefined) { 
        console.log("Error: operator 1 is missing");
        station = await promptMissingOp1();
    }
    if (op2 == undefined) { 
        console.log("Error: operator 2 is missing");
        station = await promptMissingOp2();
    }

    if (dateto == undefined) {
        console.log("Error: dateto is missing");
        dateto = await promptMissingDateTo();
    }

    const res = await axios.post(`${baseURL}/NewSettlement/${op1}/${op2}/${dateto}?format=${format}`)

    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: newsettlement");
        return [res.status];
    }
    console.log(res.data);
}
