module.exports = { healthcheck: healthcheck };

const axios = require('axios');
const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';

async function healthcheck() {
    const res = await axios.get(`${baseURL}/admin/healthcheck`);
    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: healthcheck");
        return [res.status];
    }
    console.log(res.data);
}