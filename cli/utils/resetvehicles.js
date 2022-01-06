module.exports = { resetvehicles: resetvehicles };

const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';

async function resetvehicles() {
    fs.createReadStream('./sampledata01/sampledata01_vehicles_100.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', async function (chunk) {
            const res = await axios.post(`${baseURL}/admin/resetvehicles`, { vehicleID: `${chunk.vehicleID}`, tagID: `${chunk.tagID}`, tagProvider: `${chunk.tagProvider}`, providerAbbr: `${chunk.providerAbbr}`, licenseYear: `${chunk.licenseYear}` });
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
