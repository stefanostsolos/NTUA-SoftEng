const express = require('express');
const db = require('./db');
const fs = require('fs/promises');

const router = express.Router();

async function reset(table) {
    // Isolate each row from file of defaults
    const file = await fs.readFile(`./defaults/${table}.csv`, 'utf-8');
    var rows = file.split('\n');
    rows.pop();

    // Select the appropriate SQL query for insertion
    var sql_insert;
    switch (table) {
        case 'station':
            sql_insert = 
                `INSERT INTO station (ID, operatorID, stationName) VALUES (?, ?, ?)`; 
            break;
        case 'pass':
            sql_insert = 
                `INSERT INTO pass (ID, tagID, stationID, timestamp, charge) VALUES (?, ?, ?, ?, ?)`;
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