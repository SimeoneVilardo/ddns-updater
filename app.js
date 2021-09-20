const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cron = require("node-cron");
const axios = require("axios");
const indexRouter = require("./routes/index");
const DB = require("./conf/DB");

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
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err);
});

cron.schedule("* * * * *", async function () {
    console.log("running a task every 5 minutes");
    try {
        var ip = (await axios.get("https://ipv4bot.whatismyipaddress.com")).data;
        console.log(`IP: ${ip}`);
        const domains = await DB.models.Domain.findAll();
        domains.every(async (domain) => {
            try {
                var response = await axios.get(`https://dynamicdns.park-your-domain.com/update?host=${domain.host}&domain=${domain.domain}&password=${domain.password}&ip=${ip}`);
                console.log(response.data);
            } catch (err) {
                console.error(err);
            }
        });
    } catch (err) {}
});

module.exports = app;
