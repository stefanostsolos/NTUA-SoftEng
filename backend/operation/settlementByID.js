const express = require('express');
const passport = require('passport');
const { Parser } = require('json2csv');
const db = require('../misc/db');
const aux = require('../misc/helper');
const createError = require('http-errors');

const router = express.Router();

// {baseURL}/SettlementByID
router.get('/:ID',
    passport.authenticate('jwt', { session: false }),
    async function(req, res, next) {
        try {
            const request_timestamp = aux.get_current_timestamp();

            // Check if given settlement ID is valid
            if (!aux.validate_settlementID(req.params.ID)) {
                throw new createError(400, 'Invalid request parameter (settlement ID)');
            }

            // Get path parameter
            const id = req.params.ID;

            // Check if user can access resource. This resource can be accessed
            // by any payment user and any admin user
            if (!['payment', 'admin'].includes(req.user.type)) {
                throw new createError(401);
            }

            // Fetch requested settlement data
            const sql = `SELECT * FROM settlement WHERE ID = ?`;
            const [answer] = await db.execute(sql, [id]);

            // If no settlement was found, throw 402
            if (answer.length === 0) {
                throw new createError(402, 'No settlement found with requested ID');
            }

            // Fetch requested settlement data
            const set = answer[0];
            const result = {
                RequestTimestamp: request_timestamp,
                SettlementID: set.ID,
                OperatorCredited: set.operatorCredited,
                OperatorDebited: set.operatorDebited,
                DateFrom: aux.convert_date_object(set.dateFrom),
                DateTo: aux.convert_date_object(set.dateTo),
                Amount: parseFloat(set.amount),
                Cleared: set.cleared === 1
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
    }
)

module.exports = router;