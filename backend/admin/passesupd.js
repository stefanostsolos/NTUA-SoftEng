const express = require('express');
const db = require('../db');
const multer = require('multer');
const fs = require('fs/promises');
const passport = require('passport');

const router = express.Router();
const upload = multer({ dest: './' });

async function read_rows(path) {
    const file = await fs.readFile(path, 'utf-8');
    const rows = file.split('\n');
    rows.pop();
    return rows;
}

async function validate_file(path) {
    const rows = await read_rows(path);
    const row_regex = /^\w+,\w+,\w+,\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d+.\d+$/;
    for (const row of rows) {
        if (!row_regex.test(row)) {
            return false;
        }
    }
    return true;
}

// {baseURL}/admin/passesupd
router.post('/', 
    upload.single('file'), 
    passport.authenticate('jwt', { session: false }),
    async function(req, res, next) {
        try {
            // Check if user can access resource. This resource can only be accessed by admin users
            if (req.user.type != 'admin') {
                throw new createError(401, 'Unauthorised admin');
            }
            
            // If an invalid file has been uploaded, throw 400
            if (!validate_file(req.file.path)) {
                const err = new Error("Invalid file uploaded");
                err.status = 400;
                throw(err);
            }

            const rows = await read_rows(req.file.path);

            await db.query('START TRANSACTION');

            // Query to check if pass record already exists
            const sql_check = `SELECT * FROM pass WHERE ID = ?`;

            // Query to insert new pass record
            const sql_insert = 
                `INSERT INTO pass (ID, tagID, stationID, timestamp, charge) 
                VALUES (?, ?, ?, ?, ?)`;

            // Read uploaded file line by line
            var uploaded = 0, imported = 0;
            for (const row of rows) {
                // Get fields of current row
                const [id, tagID, stationID, timestamp, charge] = row.split(',');
                uploaded++;
                
                // Check if pass record already exists
                const [check] = await db.execute(sql_check, [id]);
                if (check.length != 0) {
                    continue;
                }

                // If pass record is new, insert it into the database
                await db.execute(sql_insert, [id, tagID, stationID, timestamp, charge]); 
                imported++;
            }

            // Count pass records in database
            const sql_count = 'SELECT COUNT(*) AS value FROM pass';
            const [count] = await db.execute(sql_count);
            
            await db.query('COMMIT');

            // Delete uploaded file
            await fs.rm(req.file.path);

            res.status(200).send({
                PassesInUploadedFile : uploaded,
                PassesImported : imported,
                TotalPassesInDatabase : count[0].value
            });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;