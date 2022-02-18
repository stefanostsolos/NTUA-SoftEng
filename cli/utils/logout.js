module.exports = { logout: logout };

const axios = require('axios');
const fs = require('fs');
const jwt = require(`${__dirname}/../bin/jwt.js`);

async function logout(baseURL) {
    const token = jwt.validate();
    let res;

    await axios.post(`${baseURL}/logout`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`
        }
    }).then((response) => {
        try {
            fs.writeFileSync(`${__dirname}/../bin/token.txt`, "");
            res = response.status;
        } catch (err) {
            console.error(err);
            res = 404;
        }
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: logout");
        res = error.response.status;
    });

    return res;
}