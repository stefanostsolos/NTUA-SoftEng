const express = require('express');
const pool = require('./db');
const app = express();
const port = 9103;
const baseURL = `/interoperability/api`;

// Routing middleware
const passesupd = require('./passesupd');
const admin = require('./admin');
const passesPerStation = require('./passesPerStation');
const passesAnalysis = require('./passesAnalysis');
const passesCost = require('./passesCost');
const chargesBy = require('./chargesBy');

app.use(`${baseURL}/admin/`, admin);
app.use(`${baseURL}/admin/system/passesupd`, passesupd);
app.use(`${baseURL}/PassesPerStation`, passesPerStation);
app.use(`${baseURL}/PassesAnalysis`, passesAnalysis);
app.use(`${baseURL}/PassesCost`, passesCost);
app.use(`${baseURL}/ChargesBy/`, chargesBy);

// Middleware for undefined URLs
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send({
        error : {
            status : err.status || 500,
            message : err.message || 'Internal Server Error' 
        }
    });
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});
