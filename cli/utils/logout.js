module.exports = { logout: logout };

const axios = require('axios');
const baseURL = 'https://virtserver.swaggerhub.com/N8775/TOLLS/1.0.0';

async function logout() {
    const res = await axios.post(`${baseURL}/logout`);
    if (res.data == undefined) {
        console.log("Error 500: Internal server error");
        console.log("Found at: logout");
        return [res.status];
    }
    else return [res.status, false, res.data];
}