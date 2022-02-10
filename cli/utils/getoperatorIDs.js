module.exports = { getoperatorIDs: getoperatorIDs };

const axios = require('axios');

async function getoperatorIDs(baseURL, token) {
    let res;

    await axios.get(`${baseURL}/GetOperatorIDs`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: GetOperatorIDs");
        res = error.response.status;
    });

    return res;
}