module.exports = { getoperatorIDs: getoperatorIDs };

const axios = require('axios');

function getoperatorIDs(baseURL, token) {
    axios.get(`${baseURL}/GetOperatorIDs`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: GetOperatorIDs");
    });
}