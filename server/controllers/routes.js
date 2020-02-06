 
const express = require('express');
const router = express.Router({mergeParams: true});
const userController = require("./userController");

router.use("/user",userController);

router.get('/', function (req, res) {
    res.send({ "welcome": "It's running" });
});

router.get('/sendSms', function (req, res) {
    let result = require("../services/SMSService").sendSms("9181785 00052","Hello buddy");
    res.send({ "message":result ? "SMS Sent" : "Not sent" });
});

module.exports = router;