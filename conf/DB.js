const { Sequelize } = require("sequelize");
const domainModel = require("../models/domain");

const DB = {};
DB.models = {};

DB.init = async function () {
    var dbname = process.env.DB_NAME;
    const sequelize = new Sequelize("", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mariadb"
    });
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${dbname};`);
    await sequelize.query(`USE ${dbname};`);
    sequelize.connectionManager.config.database = dbname;
    DB.models = {
        Domain: domainModel(sequelize, Sequelize.DataTypes)
    };
    await sequelize.sync();
};

module.exports = DB;
