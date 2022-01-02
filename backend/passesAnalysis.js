const express = require('express');
const db = require('./db');
const aux = require('./helper');
const { Parser } = require('json2csv');
const createError = require('http-errors');

const router = express.Router();

// {baseURL}/PassesAnalysis
router.get('/:op1_ID/:op2_ID/:date_from/:date_to', async function(req, res, next) {
    try {
        const request_timestamp = aux.get_current_timestamp();

        // Check if path parameters are valid, throw 400 if not
        const valid = 
            aux.validate_opID(req.params.op1_ID) && 
            aux.validate_opID(req.params.op2_ID) &&
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
        if (!rows.length) {
            const err = new Error("No records found with the requested parameters");
            err.status = 402;
            throw(err);
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
        if (!req.query.format || req.query.format == 'json') {
            res.status(200).send({
                op1_ID: station_opID,
                op2_ID: tag_opID,
                RequestTimestamp: request_timestamp,
                PeriodFrom: date_from,
                PeriodTo: date_to,
                NumberOfPasses: rows.length,
                PassesList: PassesList
            });
        } else if (req.query.format == 'csv') {
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