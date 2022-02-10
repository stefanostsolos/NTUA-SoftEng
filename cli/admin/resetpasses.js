module.exports = { resetpasses: resetpasses };

const axios = require('axios');

async function resetpasses(baseURL, token) {
    let res;

    await axios.post(`${baseURL}/admin/resetpasses`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}):`)
        console.log(error.response.data);
        console.log("Found at: resetpasses");
        res = error.response.status;
    });

    return res;
}