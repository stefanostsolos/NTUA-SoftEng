module.exports = { logout: logout };

const axios = require('axios');
const fs = require('fs');

async function logout(baseURL, token) {
    let res;

    await axios.post(`${baseURL}/logout`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        fs.writeFile(`${__dirname}/../bin/token.txt`, "", 'utf8', function (err) {
            if (err) console.log(err);
        });
        res = response.status;
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: logout");
        res = error.response.status;
    });

    return res;
}