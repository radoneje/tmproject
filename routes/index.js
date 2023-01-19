const express = require('express');
const router = express.Router();
const moment=require("moment")

/* GET home page. */
router.get('/', async function(req, res, next) {
  let r=await  req.mongo.db().admin().listDatabases();
  console.log(r)
  res.render('index', { title: 'Express' });
});

module.exports = router;
