const express = require('express');
const db = require('./db');
const aux = require('./helper');

const router = express.Router();

// {baseURL}/GetStations
router.get('/', async function (req, res, next) {
    try {    
        const request_timestamp = aux.get_current_timestamp();

        const sql = 'SELECT ID FROM station';
        [rows] = await db.execute(sql);

        let id_list = [];
        for (row of rows) {
            id_list.push(row.ID);
        }

        res.status(200).send({
            RequestTimestamp: request_timestamp,
            StationIDList: id_list
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;