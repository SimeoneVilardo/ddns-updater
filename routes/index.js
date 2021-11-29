const express = require("express");
const router = express.Router();
const asyncHelper = require("../helpers/async-helper");
const DB = require("../conf/DB");

router.get(
    "/",
    asyncHelper.errorWrapper(async (req, res, next) => {
        res.json({ message: "OK" });
    })
);

router.post(
    "/domain",
    asyncHelper.errorWrapper(async (req, res, next) => {
        var host = req.body.host;
        var domain = req.body.domain;
        var password = req.body.password;
        if (!host) throw { message: `Missing field host in body`, status: 400 };
        if (!domain) throw { message: `Missing field domain in body`, status: 400 };
        if (!password) throw { message: `Missing field password in body`, status: 400 };

        var created = await DB.models.Domain.create({ host: host, domain: domain, password: password });
        res.json(created);
    })
);

router.delete(
    "/domain",
    asyncHelper.errorWrapper(async (req, res, next) => {
        var id = req.body.id;
        if (!id) throw { message: `Missing field id in body`, status: 400 };
        var domain = await DB.models.Domain.findByPk(id);
        if (!domain) throw { message: `Domain with id ${id} not found`, status: 404 };

        var destroyed = await domain.destroy();
        res.json(destroyed);
    })
);

router.get(
    "/domain",
    asyncHelper.errorWrapper(async (req, res, next) => {
        var domains = await DB.models.Domain.findAll();
        res.json(domains);
    })
);

module.exports = router;
