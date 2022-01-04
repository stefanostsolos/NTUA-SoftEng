const express = require('express');
const db = require('./db');
const passport = require('passport');
const createError = require('http-errors');
const aux = require('./helper');

const router = express.Router();

// {baseURL}/admin/users
router.get('/',
    passport.authenticate('jwt', { session: false }),
    async function(req, res, next) {
        try {
            // Check if user can access resource. This resource can only
            // be accessed by admin users
            if (!req.user.type === 'admin') {
                throw new createError(401, 'Unauthorised admin');
            }
    
            // Fetch list of users
            const sql_fetch = `SELECT username, type, operatorID FROM user`;
            const [rows] = await db.execute(sql_fetch);

            res.status(200).send(rows);
        } catch (err) {
            next(err);
        }
    }
);

router.get('/:username',
    passport.authenticate('jwt', { session: false }),
    async function (req, res, next) {
        try {
            // Check if given username is valid
            if (!aux.validate_username(req.params.username)) {
                throw new createError(400, 'Invalid username')
            }

            // Check if user can access resource. This resource can only
            // be accessed by admin users
            if (!req.user.type === 'admin') {
                throw new createError(401, 'Unauthorised admin');
            }
    
            // Fetch data of requested user
            const sql_fetch = `SELECT username, type, operatorID FROM user WHERE username = ?`;
            const [rows] = await db.execute(sql_fetch, [req.params.username]);

            // If no data was found, throw 402
            if (rows.length === 0) {
                throw new createError(402, 'No user found with requested username');
            }

            res.status(200).send(rows[0]);
        } catch (err) {
            next(err);
        }
    }
)

module.exports = router;