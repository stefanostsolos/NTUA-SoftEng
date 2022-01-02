const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const aux = require('./helper');

const router = express.Router();
const JWT_SECRET = 'my-little-secret';

passport.use(
    new LocalStrategy(async function (username, password, done) {
        try {
            // Check if given username and password are valid, throw 400 if not
            if (!aux.validate_username_password(username, password)) {
                throw new createError(400, 'Invalid username or password');
            }

            // Search for a user with the given username in the database
            const sql_find = `SELECT * FROM user WHERE username = ?`;
            const [result] = await db.execute(sql_find, [username]);

            // If the requested user does not exist, or if the given password
            // does not match, authentication fails
            if (result.length === 0) {
                return done(null, false, { message: 'Incorrect username or password' });
            }
            const user = result[0];
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Incorrect username or password' });
            }

            // If username and password match, return user attributes
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// {baseURL}/login
router.post(
    '/', express.urlencoded({ extended: false }), 
    passport.authenticate('local', { session: false }), 
    function(req, res, next) {
        try {
            const token = jwt.sign(req.user, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).send({ token: token });
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;