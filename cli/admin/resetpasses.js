module.exports = { resetpasses: resetpasses };

const axios = require('axios');

function resetpasses(baseURL, token) {
    axios.post(`${baseURL}/admin/resetpasses`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: resetpasses");
    });
}