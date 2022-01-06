module.exports = { resetpasses: resetpasses };

const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';

async function resetpasses() {
    fs.createReadStream('./sampledata01/sampledata01_passes100_8000.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', async function (chunk) {
            const res = await axios.post(`${baseURL}/admin/resetpasses`, { passID: `${chunk.passID}`, timestamp: `${chunk.timestamp}`, stationRef: `${chunk.stationRef}`, vehicleRef: `${chunk.vehicleRef}`, charge: `${chunk.charge}` });
            if (res.status != 200) {
                console.log(res.status);
                const obj = { status: "FAILED" };
                console.log(obj);
                return;
            }
        })
        .on('end', async function () {
            const res = await axios.post(`${baseURL}/admin/resetpasses`, { username: 'admin', password: `freepasses4all` });
            if (res.status != 200) {
                console.log(res.status);
                const obj = { status: "FAILED" };
                console.log(obj);
                return;
            }
            console.log(res.data);
        });
}
