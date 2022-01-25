const express = require('express');
const db = require('../misc/db');
const aux = require('../misc/helper');
const { Parser } = require('json2csv');
const createError = require('http-errors');
const passport = require('passport');

const router = express.Router();

// {baseURL}/ChargesBy
router.get('/:op_ID/:date_from/:date_to', 
    passport.authenticate('jwt', { session: false }), 
    async function(req, res, next) {
        try {
            const request_timestamp = aux.get_current_timestamp();

            // Check if path parameters are valid, throw 400 if not
            const valid = 
                aux.validate_operatorID(req.params.op_ID) && 
                aux.validate_date(req.params.date_from) &&
                aux.validate_date(req.params.date_to)

            if (!valid) {
                throw new createError(400, "Invalid input parameters (operator ID or date)");
            }

            // Get path parameters
            const [op_ID, date_from, date_to] = [
                req.params.op_ID,
                aux.convert_date_param(req.params.date_from) + ' 00:00:00',
                aux.convert_date_param(req.params.date_to) + ' 23:59:59'
            ];

            // Check if user can access resource. This resource can be accessed by any
            // any operator users whose ID matches the operator ID in the request,
            // as well as by any admin users
            const auth = 
                req.user.type === 'admin' || 
                (req.user.type === 'operator' && req.user.operatorID === op_ID);
            if (!auth) {
                throw new createError(401);
            }

            const PPOList = [];

            // Fetch operator IDs and initialise PPOList
            const sql_aux = `SELECT ID FROM operator WHERE ID <> ?`;
            const [id_rows] = await db.execute(sql_aux, [op_ID]);
            for (const id_row of id_rows) {
                PPOList.push({
                    VisitingOperator: id_row.ID,
                    NumberOfPasses: 0,
                    PassesCost: 0.0
                });
            }

            // Fetch number of passes and total cost per visiting operator
            const sql = 
                `SELECT tag.operatorID AS op_ID, COUNT(*) AS num, SUM(pass.charge) AS cost
                 FROM pass JOIN tag ON pass.tagID = tag.ID JOIN station ON pass.stationID = station.ID
                 WHERE station.operatorID = ? AND NOT tag.operatorID = ?
                       AND pass.timestamp BETWEEN ? AND ?
                 GROUP BY tag.operatorID`;
            const [rows] = await db.execute(sql, [op_ID, op_ID, date_from, date_to]);

            // Update the corresponding element of PPO list for each fetched row
            for (const row of rows) {
                const match = PPOList.find(elem => elem.VisitingOperator === row.op_ID);
                match.NumberOfPasses = row.num;
                match.PassesCost = parseFloat(row.cost);
            }

            // Check the format query parameter, then accordingly send either a JSON
            // or a CSV file as a response (or throw 400 if the format is invalid).
            if (!req.query.format || req.query.format === 'json') {
                res.status(200).send({
                    op_ID: op_ID,
                    RequestTimestamp: request_timestamp,
                    PeriodFrom: date_from,
                    PeriodTo: date_to,
                    PPOList: PPOList
                });
            } else if (req.query.format === 'csv') {
                const parser = new Parser();
                const csv = parser.parse(PPOList);
                res.status(200).send(csv);
            } else {
                throw new createError(400, "Invalid format parameter");
            }

        } catch (err) {
            next(err);
        }
});

module.exports = router;