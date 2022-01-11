module.exports = { healthcheck: healthcheck };

const axios = require('axios');

function healthcheck(baseURL) {
    axios.get(`${baseURL}/admin/healthcheck`
    ).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: healthcheck");
    });
}