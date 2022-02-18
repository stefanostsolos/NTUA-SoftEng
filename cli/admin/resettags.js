module.exports = { resettags: resettags };

const axios = require('axios');
const jwt = require(`${__dirname}/../bin/jwt.js`);

async function resettags(baseURL) {
    const token = jwt.validate();
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