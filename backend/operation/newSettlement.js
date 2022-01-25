const express = require('express');
const db = require('../misc/db');
const moment = require('moment');
const passport = require('passport');
const aux = require('../misc/helper');
const createError = require('http-errors');
const randomstring = require('randomstring');
const { Parser } = require('json2csv');

const router = express.Router();

// {baseURL}/NewSettlement
router.post('/',
    express.json(),
    passport.authenticate('jwt', { session: false }),
    async function(req, res, next) {
        try {
            const request_timestamp = aux.get_current_timestamp();

            // Check if given operator IDs are valid
            const valid = 
                aux.validate_operatorID(req.body.op1_ID) &&
                aux.validate_operatorID(req.body.op2_ID) &&
                aux.validate_date(req.body.date_to);
            if (!valid) {
                throw new createError(400, 'Invalid request parameters (operator IDs or date)');
            }

            // Get body parameters
            const [opID1, opID2, date_to] = [
                req.body.op1_ID, req.body.op2_ID,
                aux.convert_date_param(req.body.date_to) + ' 23:59:59'
            ];

            // Check if user can access resource. This resource can be accessed
            // by any operator user whose ID matches the operator ID in the request,
            // as well as by any admin user
            const auth = 
                req.user.type === 'admin' ||
                (req.user.type === 'operator' && [opID1, opID2].includes(req.user.operatorID));
            if (!auth) {
                throw new createError(401);
            }

            // Find last settlement between operators
            const sql_find = 
                `SELECT dateTo
                 FROM settlement
                 WHERE (operatorCredited = ? AND operatorDebited = ?)
                       OR (operatorCredited = ? AND operatorDebited = ?)
                 ORDER BY dateTo DESC
                 LIMIT 1`;
            const [find] = await db.execute(sql_find, [opID1, opID2, opID2, opID1]);

            // Extract the date of the last settlement
            let moment_from;
            if (find.length === 0) {
                moment_from = moment('2019-01-01 00:00:00');
            } else {
                moment_from = moment(find[0].dateTo).add(1, 'seconds');
            }
            const date_from = aux.convert_date_object(moment_from);

            // Check if date of last settlement is before requested settlement date
            if (!moment_from.isBefore(date_to)) {
                throw new createError(400, "Invalid date parameter");
            }

            // Fetch total amount owed to op1 by op2 for requested period
            const sql_main = 
                `SELECT SUM(pass.charge) AS cost
                 FROM pass JOIN station ON pass.stationID = station.ID 
                      JOIN tag ON pass.tagID = tag.ID 
                 WHERE station.operatorID = ? AND tag.operatorID = ?
                       AND pass.timestamp BETWEEN ? AND ?`
            const [answer_op1] = await db.execute(sql_main, [opID1, opID2, date_from, date_to]);
            const amount_op1 = answer_op1[0].cost ? parseFloat(answer_op1[0].cost) : 0; // Check for null

            // Fetch total amount owed to op2 by op1 for requested period
            const [answer_op2] = await db.execute(sql_main, [opID2, opID1, date_from, date_to]);
            const amount_op2 = answer_op2[0].cost ? parseFloat(answer_op2[0].cost) : 0;

            const [operatorCredited, operatorDebited, amount] = 
                amount_op1 > amount_op2 ? 
                    [opID1, opID2, parseFloat((amount_op1 - amount_op2).toFixed(2))] 
                    : [opID2, opID1, parseFloat((amount_op2 - amount_op1).toFixed(2))];

            // Generate a new settlement ID
            let settlement_id;
            const sql_id = `SELECT * FROM settlement WHERE ID = ?`;
            while (true) {
                settlement_id = randomstring.generate({ length: 10, capitalization: 'uppercase'});
                const [answer_id] = await db.execute(sql_id, [settlement_id]);
                if (answer_id.length === 0) {
                    break;
                }
            }

            // Insert new settlement into database
            const sql_insert = 
                `INSERT INTO settlement (ID, operatorCredited, operatorDebited, dateFrom, 
                 dateTo, amount) VALUES (?, ?, ?, ?, ?, ?)`;
            await db.execute(sql_insert, [
                settlement_id, operatorCredited, operatorDebited, date_from, date_to, amount
            ]);

            res.status(200).send({
                RequestTimestamp: request_timestamp,
                SettlementID: settlement_id,
                OperatorCredited: operatorCredited,
                OperatorDebited: operatorDebited,
                DateFrom: date_from,
                DateTo: date_to,
                Amount: amount,
                Cleared: false
            })
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;