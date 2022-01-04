const express = require('express');
const passport = require('passport');
const db = require('../db');
const aux = require('../helper');
const createError = require('http-errors');
const { Parser } = require('json2csv');

const router = express.Router();

// {baseURL}/SettlementByOperator
router.get('/:op_ID',
    passport.authenticate('jwt', { session: false }),
    async function(req, res, next) {
        try {
            const request_timestamp = aux.get_current_timestamp();

            // Check if given settlement ID is valid
            if (!aux.validate_operatorID(req.params.op_ID)) {
                throw new createError(400, 'Invalid request parameter (operator ID)');
            }

            // Get path parameter
            const opID = req.params.op_ID;

            // Check if user can access resource. This resource can be accessed
            // by any operator user whose ID matches the operator ID in the request 
            // and by any admin user
            const auth = 
                req.user.type === 'admin' || 
                (req.user.type === 'operator' && req.user.operatorID === opID);
            if (!auth) {
                throw new createError(401);
            }

            // Fetch requested settlement data
            const sql = `SELECT * FROM settlement WHERE operatorCredited = ? OR operatorDebited = ?`;
            const [rows] = await db.execute(sql, [opID, opID]);

            // If no results were found, throw 402
            if (rows.length === 0) {
                throw new createError(402, 'No settlement found with requested operator ID');
            }

            // Create a list to hold all fetched settlement records
            let SettlementList = [];
            for (const row of rows) {
                SettlementList.push({
                    SettlementID: row.ID,
                    OperatorCredited: row.operatorCredited,
                    OperatorDebited: row.operatorDebited,
                    DateFrom: aux.convert_date_object(row.date_from),
                    DateTo: aux.convert_date_object(row.date_to),
                    Amount: parseFloat(row.amount),
                    Cleared: row.cleared === 1
                });
            }

            // Check the format query parameter, then accordingly send either a JSON
            // or a CSV file as a response (or throw 400 if the format is invalid).        
            if (!req.query.format || req.query.format === 'json') {
                res.status(200).send({
                    RequestTimestamp: request_timestamp,
                    SettlementList: SettlementList
                });
            } else if (req.query.format === 'csv') {
                const parser = new Parser();
                const csv = parser.parse(SettlementList);
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