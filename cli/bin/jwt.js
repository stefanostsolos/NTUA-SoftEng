module.exports = { validate: validate }

const fs = require('fs');

function validate() {
    const res = fs.readFileSync('./bin/token.txt', 'utf8');
    return res;
}