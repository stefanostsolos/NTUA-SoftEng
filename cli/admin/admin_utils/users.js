

module.exports = { users: users };

const axios = require('axios');

function users(baseURL, token, username) {
    if (username == undefined) {
        axios.get(`${baseURL}/admin/users`, {
            headers: {
                'X-OBSERVATORY-AUTH': `${token}`
            }
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(`Error(${error.response.status}): ` + error.response.data);
            console.log("Found at: users");
        });
    }
    else {
        axios.get(`${baseURL}/admin/users/${username}`, {
            headers: {
                'X-OBSERVATORY-AUTH': `${token}`
            }
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(`Error(${error.response.status}): ` + error.response.data);
            console.log("Found at: users");
        });
    }
}
