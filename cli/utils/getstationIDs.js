module.exports = { getstationIDs: getstationIDs };

const axios = require('axios');
const jwt = require(`${__dirname}/../bin/jwt.js`);

async function getstationIDs(baseURL) {
    const token = jwt.validate();
    let res;

    await axios.get(`${baseURL}/GetStationIDs`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: GetStationIDs");
        res = error.response.status;
    });

    return res;
}