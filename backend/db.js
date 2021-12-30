const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'interoperability'
});

async function query(sql, params) {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
}

module.exports = {query};