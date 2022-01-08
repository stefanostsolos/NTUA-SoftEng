module.exports = { getstationids : getstationids };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const https = require('https')
const axios = require('axios')
const inquirer = require('inquirer');
const usage = ("\nUsage: ");

axios.defaults.httpsAgent = new https.Agent()

async function getstationids() {
    console.log(usage + "Fetch a list of all station IDs. This resource may be accessed by any operator, transportation or admin user.");

    const res = await axios.get(`${baseURL}/GetStationIDs?format=${format}`)

    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: getstationids");
        return [res.status];
    }
    console.log(res.data);
}
