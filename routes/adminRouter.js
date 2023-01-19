var express = require('express');
var router = express.Router();
const moment=require("moment")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("admin", {moment})
});

module.exports = router;
