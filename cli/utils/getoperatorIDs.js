module.exports = { getoperatorIDs: getoperatorIDs };

const axios = require('axios');
const jwt = require(`${__dirname}/../bin/jwt.js`);

async function getoperatorIDs(baseURL) {
    const token = jwt.validate();
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