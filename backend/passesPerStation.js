const express = require('express');
const db = require('./db');
const aux = require('./helper');
const { Parser } = require('json2csv');

const router = express.Router();

// {baseURL}/PassesPerStation 
router.get('/:stationID/:date_from/:date_to', async function (req, res, next) {
    try{
        // Get current timestamp
        const request_timestamp = aux.get_current_timestamp();

        // Check if path parameters are valid, throw 400 if not
        const valid = 
            aux.validate_stationID(req.params.stationID) &&
            aux.validate_date(req.params.date_from) &&
            aux.validate_date(req.params.date_to);

        if (!valid) {
            const err = new Error("Invalid time period or station ID");
            err.status = 400;
            throw(err);
        }

        // Get and convert request parameters
        const [stationID, date_from, date_to] = [
            req.params.stationID, 
            aux.convert_date_param(req.params.date_from) + ' 00:00:00', 
            aux.convert_date_param(req.params.date_to) + ' 23:59:59'
        ];

        // Fetch the ID and name of the station's owner
        const sql_aux = 
            `SELECT operator.ID, operator.name 
            FROM station JOIN operator ON station.operatorID = operator.ID 
            WHERE station.ID = ?`;
        const [answer] = await db.execute(sql_aux, [stationID]);
        const [station_opID, station_opName] = [answer[0].ID, answer[0].name];

        // Fetch the required information for each pass record
        const sql_main = 
            `SELECT pass.ID AS passID, pass.timestamp, tag.vehicleID, 
                    tag.operatorID AS tag_opID, operator.name AS tag_opName, pass.charge
             FROM pass JOIN tag ON pass.tagID = tag.ID 
                  JOIN operator ON tag.operatorID = operator.ID
             WHERE pass.stationID = ? AND pass.timestamp BETWEEN ? AND ?
             ORDER BY pass.timestamp ASC`;
        const [rows] = await db.execute(sql_main, [stationID, date_from, date_to]);

        // If no results were found, throw 402
        if (!rows.length) {
            const err = new Error("No pass records found with requested parameters");
            err.status = 402;
            throw(err);
        }

        // Create an element of PassesList for each fetched pass record
        let PassesList = [];
        for (const [idx, row] of rows.entries()) {
            PassesList.push({
                PassesIndex: idx,
                PassID: row.passID,
                PassTimeStamp: aux.convert_date_object(row.timestamp),
                VehicleID: row.vehicleID,
                TagProvider: row.tag_opName,
                PassType: row.tag_opID == station_opID ? "home" : "away",
                PassCharge: parseFloat(row.charge)
            });
        }

        // Check the format query parameter, then accordingly send either a JSON
        // or a CSV file as a response (or throw 400 if the format is invalid).
        if (!req.query.format || req.query.format == 'json') {
            res.status(200).send({
                Station: stationID,
                StationOperator: station_opName,
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
            const err = new Error("Invalid format parameter");
            err.status(400);
            throw(err);
        }
    } catch (err) {
        next(err); // Call error handler
    }
});

module.exports = router;