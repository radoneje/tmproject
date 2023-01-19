const express = require('express');
const router = express.Router();
const moment=require("moment")

/* GET home page. */
router.get('/', async function(req, res, next) {
  let r=await  req.mongo.db().admin().listDatabases();
  console.log(moment().format("YYYY"))
  res.render('index', { title: 'Express', moment:moment });
});

module.exports = router;
