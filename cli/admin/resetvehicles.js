module.exports = { resetvehicles: resetvehicles };

const axios = require('axios');

async function resetvehicles(baseURL, token) {
    let res;

    await axios.post(`${baseURL}/admin/resetvehicles`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: resetvehicles");
        res = error.response.status;
    });

    return res;
}