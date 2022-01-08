const usage = ("\nUsage: ");
module.exports = { passesupd : passesupd };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const fs = require('fs');
const https = require('https')
const csv = require('csv-parser');
const axios = require('axios')
axios.defaults.httpsAgent = new https.Agent()

async function passesupd() {
    console.log(usage + "Post a CSV file containing any number of pass records, one per row. Any uploaded records not already in the database will be inserted into it. Only admin users may access this resource.")
    
    fs.createReadStream('./sampledata01/sampledata01_passes100_8000.csv ')
        .pipe(csv({ separator: ';' }))
        .on('data', async function (chunk) {
            const res = await axios.post(`${baseURL}/admin/passesupd`, { passID: `${chunk.passID}`, timestamp: `${chunk.timestamp}`, stationRef: `${chunk.stationRef}`, vehicleRef: `${chunk.vehicleRef}`, charge: `${chunk.charge}` });
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
