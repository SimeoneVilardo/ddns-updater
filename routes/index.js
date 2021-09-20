const express = require("express");
const router = express.Router();
const asyncHelper = require("../helpers/async-helper");
const axios = require("axios");
const DB = require("../conf/DB");

/* GET home page. */
router.get(
    "/",
    asyncHelper.errorWrapper(async (req, res, next) => {
        try {
            console.log(DB.models);
            var ip = (await axios.get("https://ipv4bot.whatismyipaddress.com")).data;
            var response = await axios.get(`https://dynamicdns.park-your-domain.com/update?host=@&domain=streameone.ga&password=351ed1bb140b43a9ac31b47e77680f2f&ip=${ip}`);
            res.json({ title: `IP: ${ip}`, ddns_response: response.data });
        } catch (err) {
            console.error(err);
            res.json(err);
        }
    })
);

router.post(
    "/add-domain",
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

router.post(
    "/delete-domain",
    asyncHelper.errorWrapper(async (req, res, next) => {
        var id = req.body.id;
        if (!id) throw { message: `Missing field id in body`, status: 400 };
        var domain = await DB.models.Domain.findByPk(id);
        if (!domain) throw { message: `Domain with id ${id} not found`, status: 404 };
        var destroyed = await domain.destroy();
        res.json(destroyed);
    })
);

module.exports = router;
