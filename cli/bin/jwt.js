module.exports = { validate: validate }

const fs = require('fs');

function validate() {
    var stream;

    try {
        stream = fs.readFileSync(`${__dirname}/token.txt`, 'utf8');
    } catch (err) {
        console.log(err)
        res = 400;
        return res;
    }
    return stream;
}