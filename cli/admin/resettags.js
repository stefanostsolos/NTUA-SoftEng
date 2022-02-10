module.exports = { resettags: resettags };

const axios = require('axios');

async function resettags(baseURL, token) {
    let res;

    await axios.post(`${baseURL}/admin/resettags`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: resettags");
        res = error.response.status;
    });

    return res;
}