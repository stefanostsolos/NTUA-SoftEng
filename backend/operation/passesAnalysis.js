const express = require('express');
const db = require('../misc/db');
const aux = require('../misc/helper');
const { Parser } = require('json2csv');
const createError = require('http-errors');
const passport = require('passport');

const router = express.Router();

// {baseURL}/PassesAnalysis
router.get('/:op1_ID/:op2_ID/:date_from/:date_to', 
    passport.authenticate('jwt', { session: false }),
    async function(req, res, next) {
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
                aux.convert_date_param(req.params.date_from) + ' 00:00:00',
                aux.convert_date_param(req.params.date_to) + ' 23:59:59'
            ];

            // Check if user can access resource. This resource can be accessed by any
            // any operator users whose ID matches either of the operator IDs in the request,
            // as well as by any trasnportation users and any admin users
            const auth = 
                req.user.type === 'admin' || req.user.type === 'transportation' ||
                (req.user.type === 'operator' && req.user.operatorID === station_opID) || 
                (req.user.type === 'operator' && req.user.operatorID === tag_opID);
            if (!auth) {
                throw new createError(401);
            }


            let PassesList = [];

            // Fetch information for each element of PassesList
            const sql = 
                `SELECT pass.ID AS passID, station.ID AS stationID, pass.timestamp, 
                        vehicle.ID AS vehicleID, pass.charge
                FROM pass JOIN station ON pass.stationID = station.ID 
                    JOIN tag ON pass.tagID = tag.ID 
                    JOIN vehicle ON tag.vehicleID = vehicle.ID
                WHERE station.operatorID = ? AND tag.operatorID = ?
                    AND pass.timestamp BETWEEN ? AND ?
                ORDER BY pass.timestamp ASC`;
            const [rows] = await db.execute(sql, [station_opID, tag_opID, date_from, date_to]);

            // If no results were found, throw 402
            if (rows.length === 0) {
                throw new createError(402, "No pass records found with requested parameters");
            }

            // Create an element of PassesList for each fetched row
            for (const [idx, row] of rows.entries()) {
                PassesList.push({
                    PassIndex: idx,
                    PassID: row.passID,
                    StationID: row.stationID,
                    TimeStamp: aux.convert_date_object(row.timestamp),
                    VehicleID: row.vehicleID,
                    Charge: parseFloat(row.charge)
                });
            }

            // Check the format query parameter, then accordingly send either a JSON
            // or a CSV file as a response (or throw 400 if the format is invalid).
            if (!req.query.format || req.query.format === 'json') {
                res.status(200).send({
                    op1_ID: station_opID,
                    op2_ID: tag_opID,
                    RequestTimestamp: request_timestamp,
                    PeriodFrom: date_from,
                    PeriodTo: date_to,
                    NumberOfPasses: rows.length,
                    PassesList: PassesList
                });
            } else if (req.query.format === 'csv') {
                const parser = new Parser();
                const csv = parser.parse(PassesList);
                res.status(200).send(csv);
            } else {
                throw(new createError(400, "Invalid format parameter"));
            }
        } catch (err) {
            next(err);
        }
})

module.exports = router;