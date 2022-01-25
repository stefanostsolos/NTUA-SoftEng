const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'interoperability'
});

module.exports = pool;