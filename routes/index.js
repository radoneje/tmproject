const express = require('express');
const router = express.Router();
const moment=require("moment")
const path = require("path");
const fs = require("fs");
const {ObjectId} = require('mongodb');

/* GET home page. */
router.get('/', async function(req, res, next) {

  let ret =  await req.db.collection('general').findOne({id:"facts"})
  let facts=ret.value;
  let videos=await req.db.collection('videos').find({isDeleted:false, isActive:true},{sort: { id: 1 },}).toArray();
  //videos=videos.reverse();
  console.log(videos)
  res.render('index', { videos, facts , year:moment().format("YYYY")});
});
router.get('/file/:filename', async function(req, res, next) {

  console.log(req.params.filename)
  let ret =  await req.db.collection('files').findOne({filename:req.params.filename})
  console.log(ret)
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
router.get('/video/:_id', async (req, res, next)=> {
 // let video =  await req.db.collection('videos').findOne({_id:ObjectId(req.params._id)})
  res.render("video", {video})
});

module.exports = router;
