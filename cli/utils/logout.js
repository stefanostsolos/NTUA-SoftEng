module.exports = { logout: logout };

const axios = require('axios');
const fs = require('fs');

function logout(baseURL, token) {
    axios.post(`${baseURL}/logout`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then(() => {
        fs.writeFile('./bin/token.txt', "", 'utf8', function (err) {
            if (err) console.log(err);
        });
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: logout");
    });
}