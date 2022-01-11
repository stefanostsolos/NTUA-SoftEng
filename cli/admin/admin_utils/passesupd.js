module.exports = { passesupd: passesupd };

const axios = require('axios');
const FormData = require('formdata');

async function passesupd(baseURL, token, source) {
    console.log(source)
    let fd = new FormData(source);

    axios.post(`${baseURL}/admin/passesupd`, {}, {
        headers: {
            'X-OBSERVATORY-AUTH': `${token}`,
            'form-data': fd
        }
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.log(`Error(${error.response.status}): ` + error.response.data);
        console.log("Found at: users");
    });
}