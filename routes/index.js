const express = require('express');
const router = express.Router();
const moment=require("moment")
const path = require("path");
const fs = require("fs");

/* GET home page. */
router.get('/', async function(req, res, next) {

  let ret =  await req.db.collection('general').findOne({id:"facts"})
  let facts=ret.value;
  res.render('index', { title: 'Express', year:moment().format("YYYY"), facts });
});
router.get('/file/:filename', async function(req, res, next) {

  let ret =  await req.db.collection('files').findOne({filename:req.body.filename})
  if(!ret)
    return res.sendStatus(404);
  var file = path.join(__dirname, "..", ret.path);

  var filename = ret.originalname;
  var mimetype = ret.mimetype;

  res.setHeader('Content-disposition', 'attachment; filename=' + encodeURI(filename));
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
});

module.exports = router;
