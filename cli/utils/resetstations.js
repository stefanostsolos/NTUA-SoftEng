module.exports = { resetstations: resetstations };

const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';

async function resetstations() {
    let code, data;
    fs.createReadStream('./sampledata01/sampledata01_stations.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', async function (chunk) {
            const res = await axios.post(`${baseURL}/admin/resetstations`, { stationID: `${chunk.stationID}`, stationProvider: `${chunk.stationProvider}`, stationName: `${chunk.stationName}` });
            if (res.status != 200) {
                console.log(res.status);
                const obj = { status: "FAILED" };
                console.log(obj);
                return;
            }
            code = res.status;
            data = res.data;
        })
        .on('end', function () {
            const obj = { status: "OK" };
            console.log(obj);
        });
}