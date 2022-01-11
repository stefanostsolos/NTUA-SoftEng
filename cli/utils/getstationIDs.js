module.exports = { getstationIDs: getstationIDs };

const axios = require('axios');

function getstationIDs(baseURL, token) {
    axios.get(`${baseURL}/GetStationIDs`, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: GetStationIDs");
    });
}