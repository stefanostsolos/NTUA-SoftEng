const express = require('express');
const db = require('./db');
const aux = require('./helper');
const { Parser } = require('json2csv');
const createError = require('http-errors');
const passport = require('passport');

const router = express.Router();

// {baseURL}/PassesCost
router.get('/:op1_ID/:op2_ID/:date_from/:date_to', 
    passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            const request_timestamp = aux.get_current_timestamp();

            // Check if path parameters are valid, throw 400 if not
            const valid = 
                aux.validate_operatorID(req.params.op1_ID) && 
                aux.validate_operatorID(req.params.op2_ID) &&
                aux.validate_date(req.params.date_from) &&
                aux.validate_date(req.params.date_to) &&
                req.params.op1_ID != req.params.op2_ID;

            if (!valid) {
                throw(new createError(400, "Invalid input parameters (operator ID or date)"));
            }

            // Get path parameters
            const [station_opID, tag_opID, date_from, date_to] = [
                req.params.op1_ID, req.params.op2_ID,
                aux.convert_date_param(req.params.date_from),
                aux.convert_date_param(req.params.date_to)
            ];

            // Check if user can access resource. This resource can be accessed by any
            // any operator users whose ID matches either of the operator IDs in the request,
            // as well as by any admin users
            const auth = 
                req.user.type === 'admin' || 
                (req.user.type === 'operator' && req.user.operatorID === station_opID) || 
                (req.user.type === 'operator' && req.user.operatorID === tag_opID);
            if (!auth) {
                throw new createError(401);
            }

            // Fetch number of passes and total cost
            const sql = 
                `SELECT COUNT(*) AS num, SUM(pass.charge) AS cost
                FROM pass JOIN station ON pass.stationID = station.ID 
                    JOIN tag ON pass.tagID = tag.ID 
                WHERE station.operatorID = ? AND tag.operatorID = ?
                    AND pass.timestamp BETWEEN ? AND ?`
            const [answer] = await db.execute(sql, [station_opID, tag_opID, date_from, date_to]);
            const [num_passes, passes_cost] = [answer[0].num, answer[0].cost];
            const result = {
                op1_ID: station_opID,
                op2_ID: tag_opID,
                RequestTimestamp: request_timestamp,
                PeriodFrom: date_from,
                PeriodTo: date_to,
                NumberOfPasses: parseInt(num_passes),
                PassesCost: parseFloat(passes_cost)
            }

            // Check the format query parameter, then accordingly send either a JSON
            // or a CSV file as a response (or throw 400 if the format is invalid).        
            if (!req.query.format || req.query.format === 'json') {
                res.status(200).send(result);
            } else if (req.query.format === 'csv') {
                const parser = new Parser();
                const csv = parser.parse(result);
                res.status(200).send(csv);
            } else {
                throw(new createError(400, "Invalid format parameter"));
            }
        } catch (err) {
            next(err);
        }
});

module.exports = router;