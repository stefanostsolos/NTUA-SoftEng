const bcrypt = require('bcrypt');
const saltRounds = 10;
const hashed_password = bcrypt.hashSync('freepasses4all', saltRounds);

module.exports = {
    username: 'admin',
    hashed_password: hashed_password,
    type: 'admin',
    operatorID: null
}