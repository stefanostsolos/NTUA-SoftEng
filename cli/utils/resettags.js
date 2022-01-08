const usage = ("\nUsage: ");
module.exports = { resettags : resettags };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const fs = require('fs');
const https = require('https')
const csv = require('csv-parser');
const axios = require('axios')
axios.defaults.httpsAgent = new https.Agent()

async function resettags() {
    console.log(usage + "Resets the tag records in the database to default.")
    
    fs.createReadStream('./sampledata01/sampledata01_verification.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', async function (chunk) {
            const res = await axios.post(`${baseURL}/admin/resettags`, { vehicleID: `${chunk.vehicleID}`, tagID: `${chunk.tagID}`, tagProvider: `${chunk.tagProvider}`, providerAbbr: `${chunk.providerAbbr}`, licenseYear: `${chunk.licenseYear}` });
            if (res.status != 200) {
                console.log(res.status);
                const obj = { status: "FAILED" };
                console.log(obj);
                return;
            }
        })
        .on('end', function () {
            const obj = { status: "OK" };
            console.log(obj);
        });
}
