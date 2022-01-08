const usage = ("\nUsage: ");
module.exports = { resetadmin : resetadmin };

const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';
const https = require('https')
const axios = require('axios')
axios.defaults.httpsAgent = new https.Agent()

async function resetadmin() {
    console.log(usage + "Resets the administrator user account to default (username: admin,  password: freepasses4all).")
    
    const res = await axios.post(`${baseURL}/admin/resetadmin`, { username: 'admin', password: `freepasses4all` });
    if (res.status != 200) {
        console.log(res.status);
        const obj = { status: "FAILED" };
        console.log(obj);
        return;
    }
}
