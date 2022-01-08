module.exports = { users : users };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const https = require('https')
const axios = require('axios')
const inquirer = require('inquirer');
const usage = ("\nUsage: ");

axios.defaults.httpsAgent = new https.Agent()

async function users() {
    console.log(usage + "Get data of all users. Only admin users may access this resource.");

    const res = await axios.get(`${baseURL}/admin/users?format=${format}`)

    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: users");
        return [res.status];
    }
    console.log(res.data);
}
