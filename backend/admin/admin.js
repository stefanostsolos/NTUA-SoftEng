const express = require('express');
const db = require('../db');
const fs = require('fs/promises');


const router = express.Router();
const ADMIN = require('../default_admin');

async function reset(table) {
    // Isolate each row from file of defaults
    const file = await fs.readFile(`./defaults/${table}.csv`, 'utf-8');
    let rows = file.split('\n');
    rows.pop();

    // Select the appropriate SQL query for insertion
    let sql_insert;
    switch (table) {
        case 'pass':
            sql_insert =
                `INSERT INTO pass (ID, tagID, stationID, timestamp, charge) VALUES (?, ?, ?, ?, ?)`
            break;
        case 'station':
            sql_insert = 
                `INSERT INTO station (ID, operatorID, stationName) VALUES (?, ?, ?)`; 
            break;
        case 'tag':
            sql_insert = 
                `INSERT INTO tag (ID, vehicleID, operatorID) VALUES (?, ?, ?)`;
            break;
        case 'vehicle':
            sql_insert = 
                `INSERT INTO vehicle (ID, licenseYear) VALUES (?, ?)`;
            break;
    }

    // Start transaction and delete all rows
    await db.query('START TRANSACTION');
    await db.execute(`DELETE FROM ${table}`);

    // Read default data row by row and import
    for (const row of rows) {
        params = row.split(',');
        await db.execute(sql_insert, params);
    }

    // If successful, commit transaction
    await db.query('COMMIT');
}

// {baseURL}/admin/
router.post('/resetadmin', async function(req, res) {
    try {
        // Check if a user with the default admin username exists
        const sql_check = `SELECT * FROM user WHERE username = ?`;
        const [check] = await db.execute(sql_check, [ADMIN.username]);

        // If not, create a default user account
        if (check.length === 0) {
            const sql_main = `INSERT INTO user (username, password, type, operatorID) VALUES (?, ?, ?, ?)`;
            await db.execute(sql_main, 
                [ADMIN.username, ADMIN.hashed_password, ADMIN.type, ADMIN.operatorID]
            );
        } else {
            const sql_main = `UPDATE user SET password = ?, type = ?, operatorID = ? WHERE user.username = ?`;
            await db.execute(sql_main, 
                [ADMIN.hashed_password, ADMIN.type, ADMIN.operatorID, ADMIN.username]
            );
        }

        res.status(200).send({ status: 'OK' });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: "failed",
            details: err.message ? err.message : ""
        });
    }
});

router.post('/resetstations', async function(req, res) {
    try {
        await reset('station');
        res.status(200).send({ status: "OK" });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: "failed",
            details: err.message ? err.message : ""
        });
    }
});

router.post('/resetpasses', async function(req, res) {
    try {
        await reset('pass');
        res.status(200).send({ status: "OK" });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: "failed",
            details: err.message ? err.message : ""
        });
    }
});

router.post('/resettags', async function(req, res) {
    try {
        await reset('tag');
        res.status(200).send({ status: "OK" });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: "failed",
            details: err.message ? err.message : ""
        });
    }
});

router.post('/resetvehicles', async function(req, res) {
    try {
        await reset('vehicle');
        res.status(200).send({ status: "OK" });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: "failed",
            details: err.message ? err.message : ""
        });
    }
});

router.get('/healthcheck', async function(req, res, next) {
    try {
        // Check for connection
        const conn = await db.getConnection();
        var config, status;
        if (conn) {
            config = conn.connection.config;
            status = "OK";
        } else {
            config = db.pool.config;
            status = "failed";
        }

        // Create database connection string
        const dbconnection = 
            `Server=${config.host};Database=${config.database};` + 
            `UserId=${config.user};Password=${config.password}`;
        res.status(200).send({
            status: status,
            dbconnection: dbconnection
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;