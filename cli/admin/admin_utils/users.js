module.exports = { users: users };

const axios = require('axios');

async function users(baseURL, token, username) {
    let res;

    if (username == undefined) {
        await axios.get(`${baseURL}/admin/users`, {
            headers: {
                'X-OBSERVATORY-AUTH': `${token}`
            }
        }).then((response) => {
            console.log(response.data);
            res = response.status;
        }).catch((error) => {
            console.log(`Error(${error.response.status}): ` + error.response.data);
            console.log("Found at: users");
            res = error.response.status;
        });
    }
    else {
        await axios.get(`${baseURL}/admin/users/${username}`, {
            headers: {
                'X-OBSERVATORY-AUTH': `${token}`
            }
        }).then((response) => {
            console.log(response.data);
            res = response.status;
        }).catch((error) => {
            console.log(`Error(${error.response.status}): ` + error.response.data);
            console.log("Found at: users");
            res = error.response.status;
        });
    }

    return res;
}