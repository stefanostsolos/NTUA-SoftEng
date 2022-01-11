module.exports = { resetvehicles: resetvehicles };

const axios = require('axios');

function resetvehicles(baseURL, token) {
    axios.post(`${baseURL}/admin/resetvehicles`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: resetvehicles");
    });

}