const express = require('express');
const passport = require('passport');
const createError = require('http-errors');
const db = require('../db');
const aux = require('../helper');

const router = express.Router();

// {baseURL}/GetStations
router.get('/', 
    passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
    try {
        const request_timestamp = aux.get_current_timestamp();
        
        if (! ['operator', 'transportation', 'admin'].includes(req.user.type)) {
            throw new createError(401);
        }

        const sql = 'SELECT ID FROM operator';
        [rows] = await db.execute(sql);

        let id_list = [];
        for (row of rows) {
            id_list.push(row.ID);
        }

        res.status(200).send({
            RequestTimestamp: request_timestamp,
            OperatorIDList: id_list
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;