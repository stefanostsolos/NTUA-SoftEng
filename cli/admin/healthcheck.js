module.exports = { healthcheck: healthcheck };

const axios = require('axios');

async function healthcheck(baseURL) {
    let res;
    await axios.get(`${baseURL}/admin/healthcheck`
    ).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: healthcheck");
        res = error.response.status;
    });

    return res;
}