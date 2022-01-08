module.exports = { getoperatorids : getoperatorids };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const https = require('https')
const axios = require('axios')
const inquirer = require('inquirer');
const usage = ("\nUsage: ");

axios.defaults.httpsAgent = new https.Agent()

async function getoperatorids() {
    console.log(usage + "Fetch a list of all operator IDs. This resource may be accessed by any operator, transportation or admin user.");

    const res = await axios.get(`${baseURL}/GetOperatorIDs?format=${format}`)

    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: getoperatorids");
        return [res.status];
    }
    console.log(res.data);
}
