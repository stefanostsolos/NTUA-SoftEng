module.exports = { resetstations: resetstations };

const axios = require('axios');

function resetstations(baseURL, token) {
    axios.post(`${baseURL}/admin/resetstations`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: resetstations");
    });
}