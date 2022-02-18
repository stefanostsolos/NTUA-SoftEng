module.exports = { resetstations: resetstations };

const axios = require('axios');
const jwt = require(`${__dirname}/../bin/jwt.js`);

async function resetstations(baseURL) {
    const token = jwt.validate();
    let res;

    await axios.post(`${baseURL}/admin/resetstations`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: resetstations");
        res = error.response.status;
    });

    return res;
}