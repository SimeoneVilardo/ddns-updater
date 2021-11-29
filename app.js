const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cron = require("node-cron");
const axios = require("axios");
const indexRouter = require("./routes/index");
const DB = require("./conf/DB");
const config = require("./conf/config");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next({ message: "Not Found", status: 404 });
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
});

cron.schedule(config.cron.time, async function () {
    console.log(`Running a cron task with config ${config.cron.time}`);
    try {
        const domains = await DB.models.Domain.findAll();
        console.log("domains", domains);
        domains.every(async (domain) => {
            try {
                var response = await axios.get(config.url.update_ip, {params: {host:domain.host, domain:domain.domain, password: domain.password}});
                console.log(response.data);
            } catch (err) {
                console.error(err);
            }
        });
    } catch (err) {
        console.error(err);
    }
});

module.exports = app;
