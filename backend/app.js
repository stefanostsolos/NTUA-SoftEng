const express = require('express');
const passport = require('passport');
const createError = require('http-errors');
const morgan = require('morgan');

const app = express();
const port = 9103;
const baseURL = `/interoperability/api`;

// Logger middleware
app.use(morgan('dev'));

// Authentication middleware
app.use(passport.initialize());

// Routing middleware
const login = require('./login')
const usermod = require('./usermod');
const passesupd = require('./passesupd');
const admin = require('./admin');
const passesPerStation = require('./passesPerStation');
const passesAnalysis = require('./passesAnalysis');
const passesCost = require('./passesCost');
const chargesBy = require('./chargesBy');
const getStations = require('./getStations')

app.use(`${baseURL}/login`, login);
app.use(`${baseURL}/admin/usermod`, usermod);
app.use(`${baseURL}/admin/`, admin);
app.use(`${baseURL}/admin/system/passesupd`, passesupd);
app.use(`${baseURL}/PassesPerStation`, passesPerStation);
app.use(`${baseURL}/PassesAnalysis`, passesAnalysis);
app.use(`${baseURL}/PassesCost`, passesCost);
app.use(`${baseURL}/ChargesBy/`, chargesBy);
app.use(`${baseURL}/GetStations`, getStations);

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

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
