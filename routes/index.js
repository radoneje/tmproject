var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let r=await  req.mongo.listDatabases(client);
  console.log(r)
  res.render('index', { title: 'Express' });
});

module.exports = router;
