const express = require('express');
const db = require('./db');
const aux = require('./helper');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

const router = express.Router();

// {baseURL}/admin/usermod
router.post('/', express.json(), async function(req, res, next) {
    try {
        // Check if given username and password are valid, throw 400 if not
        const [username, password, type, operatorID] = [
            req.body.username, req.body.password, req.body.type, req.body.operatorID
        ];
        if (!aux.validate_user_attributes(username, password, type, operatorID)) {
            throw new createError(400, 'Invalid user attributes');
        }

        // Hash given password
        const saltRounds = 10;
        const hashed_password = await bcrypt.hash(password, saltRounds);

        // Check if a user with the given username already exists
        const sql_check = `SELECT * FROM user WHERE username = ?`;
        const [check] = await db.execute(sql_check, [username]);
        
        // If user does not already exist, add new user to database, else
        // update attribues of existing user
        if (check.length == 0) {
            const sql_main = 
                `INSERT INTO user (username, password, type, operatorID) VALUES (?, ?, ?, ?)`;
            await db.execute(sql_main, [username, hashed_password, type, operatorID]);
        } else {
            const sql_main = 
                `UPDATE user SET password = ?, type = ?, operatorID = ? WHERE user.username = ?`;
            await db.execute(sql_main, [hashed_password, type, operatorID, username]);
        }

        res.status(200).send({
            username: username,
            password: password,
            type: type,
            operatorID: operatorID
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;