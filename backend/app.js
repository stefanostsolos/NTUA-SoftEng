const express = require('express');
const passport = require('passport');
const createError = require('http-errors');
const morgan = require('morgan');
const db = require('./misc/db');
const bcrypt = require('bcrypt');
const aux = require('./misc/helper');
const cors = require('cors');

const app = express();
const port = 9103;
const baseURL = `/interoperability/api`;

const corsOptions = {
    origin: ' http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
   next();
 });


app.use(cors(corsOptions))

// Logger middleware
app.use(morgan('dev'));

// Authentication middleware
app.use(passport.initialize());

// Configure authentication strategy for username/password login
const LocalStrategy = require('passport-local').Strategy;

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

// Configure authentication strategy for authorised operations using JWT
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JWT_SECRET = require('./misc/jwt-secret');
const CUSTOM_HEADER = 'x-observatory-auth';

passport.use(
    new JwtStrategy ({
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromHeader(CUSTOM_HEADER)
        }, function(jwt_payload, done) {
            return done(null, { 
                username: jwt_payload.username, 
                type: jwt_payload.type,
                operatorID: jwt_payload.operatorID 
            });
        }
    )
);

// Routing middleware
const login_logout = require('./operation/login_logout');
const users = require('./admin/users');
const usermod = require('./admin/usermod');
const passesupd = require('./admin/passesupd');
const admin = require('./admin/admin');
const passesPerStation = require('./operation/passesPerStation');
const passesAnalysis = require('./operation/passesAnalysis');
const passesCost = require('./operation/passesCost');
const chargesBy = require('./operation/chargesBy');
const getStationIDs = require('./operation/getStationIDs');
const getOperatorIDs = require('./operation/getOperatorIDs');
const newSettlement = require('./operation/newSettlement');
const settlementByID = require('./operation/settlementByID');
const settlementsByOperator = require('./operation/settlementsByOperator');
const clearSettlement = require('./operation/clearSettlement');

app.use(baseURL, login_logout);
app.use(`${baseURL}/admin/users`, users);
app.use(`${baseURL}/admin/usermod`, usermod);
app.use(`${baseURL}/admin`, admin);
app.use(`${baseURL}/admin/passesupd`, passesupd);
app.use(`${baseURL}/PassesPerStation`, passesPerStation);
app.use(`${baseURL}/PassesAnalysis`, passesAnalysis);
app.use(`${baseURL}/PassesCost`, passesCost);
app.use(`${baseURL}/ChargesBy`, chargesBy);
app.use(`${baseURL}/GetStationIDs`, getStationIDs);
app.use(`${baseURL}/GetOperatorIDs`, getOperatorIDs);
app.use(`${baseURL}/NewSettlement`, newSettlement);
app.use(`${baseURL}/SettlementByID`, settlementByID);
app.use(`${baseURL}/SettlementsByOperator`, settlementsByOperator);
app.use(`${baseURL}/ClearSettlement`, clearSettlement);

// Middleware for undefined URLs
app.use((req, res, next) => {
    next(createError(404, "Not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    if (status >= 500 || req.app.get('env') == 'development') {
        console.error(err.stack);
    }
    res.status(status).send(message);
});

// Begin listening at predetermined port
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
