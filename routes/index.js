const express = require('express');
const router = express.Router();
const moment=require("moment")
const path = require("path");
const fs = require("fs");
const {ObjectId} = require('mongodb');
const sections=[{t:"Профиль деятельности", id:"profiles", color:"#40CFF9"},{t:"Услуги", id:"services", color:"#F21A05"},{t:"Форматы", id:"formats", color:"#6944F0"}]
const commands=[{t:"1", id:"spec"},{t:"2", id:"russia"},{t:"3", id:"word"}]
/* GET home page. */
router.get('/', async function(req, res, next) {

  let ret =  await req.db.collection('general').findOne({id:"facts"})
  let facts=ret.value;
  let videos=await req.db.collection('videos').find({isDeleted:false, isActive:true},{sort: { id: 1 },}).toArray();
  videos=videos.reverse();

  let services={}
  for(let sect of sections){

    let r=await req.db.collection(sect.id).find({isDeleted:false, isActive:true},{sort: { id: 1 },}).toArray();
    services[sect.id]= r.reverse()
  }
  let geografy={}
  for(let sect of commands){

    let r=await req.db.collection(sect.id).find({isDeleted:false, isActive:true},{sort: { id: 1 },}).toArray();
    geografy[sect.id]= r.reverse()
  }
  let mainImages=await req.db.collection("mainImages").find({isDeleted:false, isActive:true},{sort: { id: 1 },}).toArray();


  res.render('index', { videos, facts ,sections,services,commands,geografy,mainImages, year:moment().format("YYYY")});
});
router.get('/sections', async function(req, res, next) {
  res.json(sections)
})
router.get('/commands', async function(req, res, next) {
  res.json(commands)
})
router.get('/projects', async function(req, res, next) {
  let ret =  await req.db.collection('general').findOne({id:"facts"})

  let projects=await req.db.collection("projects").find({isDeleted:false, isActive:true},{sort: { id: 1 },}).toArray();
  projects.forEach(p=>{
    p.images=p.images.filter(i=>!i.isDeleted)
  })
  res.render("projects",{projects, facts:ret.value})
})




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
  let video =  await req.db.collection('videos').findOne({_id:ObjectId(req.params._id)})
  video.YTlink=video.YTlink.replace("https://youtu.be/","https://www.youtube.com/embed/")
  video.YTlink=video.YTlink.replace(/().+?v=(.+)/,"https://www.youtube.com/embed/$2")

  res.render("video", {video})
});
router.get('/projectImages/:_id', async (req, res, next)=> {
  let project =  await req.db.collection('projects').findOne({_id:ObjectId(req.params._id)})

  res.render("projectImages", {project})
});


module.exports = router;
