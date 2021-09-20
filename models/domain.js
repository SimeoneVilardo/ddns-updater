module.exports = (sequelize, DataTypes) => {
    return sequelize.define("domain", {
        host: DataTypes.STRING,
        domain: DataTypes.STRING,
        password: DataTypes.STRING
    });
};
