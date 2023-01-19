const express = require('express');
const router = express.Router();
const moment=require("moment")

/* GET home page. */
router.get('/', async function(req, res, next) {

  let ret =  await req.db.collection('general').findOne({id:"facts"})
  let facts=ret.value;
  res.render('index', { title: 'Express', year:moment().format("YYYY"), facts });
});

module.exports = router;
