module.exports = { passesupd: passesupd };

const axios = require('axios');
const fs = require('fs');
const { FormData } = require('formdata-node');
const inquirer = require('inquirer');
const jwt = require(`${__dirname}/../../bin/jwt.js`);

async function promptMissingSource() {
    const question = [];

    question.push({
        type: 'input',
        name: 'source',
        message: 'Please type a file source (skip " " from the path)',
    });

    const answer = await inquirer.prompt(question);
    return answer.source;
}

async function passesupd(baseURL, source) {
    const token = jwt.validate();
    let res;

    if (source == undefined) {
        console.log("source is missing");
        source = await promptMissingSource();
    }

    var stream;

    try {
        stream = fs.readFileSync(source);
    } catch (err) {
        console.log("Error(404): file does not exist");
        console.log("Found at: passesupd");
        res = 404;
        return res;
    }
    const formData = new FormData();
    formData.append('file', stream);
    await axios.post(`${baseURL}/admin/passesupd`, { file: formData.getAll('file')[0] }, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`,
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: passesupd");
        res = error.response.status;
    });

    return res;
}
