module.exports = { resettags: resettags };

const axios = require('axios');

function resettags(baseURL, token) {
    axios.post(`${baseURL}/admin/resettags`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: resettags");
    });
}