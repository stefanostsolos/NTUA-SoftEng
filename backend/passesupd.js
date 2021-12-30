const express = require('express');
const db = require('./db');
const multer = require('multer');
const fs = require('fs');
const readline = require('readline');

const router = express.Router();
const upload = multer({ dest: './uploads' });

async function validate_file(path) {
    const fileStream = fs.createReadStream(path);
    const rl = readline.createInterface({ input: fileStream });

    row_regex = /^\w+,\w+,\w+,\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d+.\d+$/
    for await (const row of rl) {
        if (!row_regex.test(row)) {
            return false;
        }
    }
    return true;
}

router.post('/', upload.single('file'), async function(req, res, next) {
    try {
        // If an invalid file has been uploaded, throw 400
        if (!validate_file(req.file.path)) {
            err = new Error("Invalid file uploaded");
            err.status = 400;
            throw(err);
        }
        const fileStream = fs.createReadStream(req.file.path);
        const rl = readline.createInterface({ input: fileStream });

        // Read uploaded file line by line
        var uploaded = 0, imported = 0;
        for await (const row of rl) {
            const [id, tagId, stationID, timestamp, charge] = row.split(',');
            uploaded++;
            
            // Check if pass record already exists
            const sql_check = `SELECT * FROM pass WHERE ID = ?`;
            const check = await db.query(sql_check, [id]);
            if (check.length != 0) {
                continue;
            }

            // If pass record is new, insert it into the database
            const sql_insert = 
            `INSERT INTO pass (ID, tagID, stationID, timestamp, charge) 
             VALUES (?, ?, ?, ?, ?)`;
            await db.query(sql_insert, [id, tagId, stationID, timestamp, charge]); 
            imported++;
        }

        // Count pass records in database
        const sql_count = 'SELECT COUNT(*) AS value FROM pass';
        const count = await db.query(sql_count);
    
        res.status(200).send({
            PassesInUploadedFile : uploaded,
            PassesImported : imported,
            TotalPassesInDatabase : count[0].value
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;