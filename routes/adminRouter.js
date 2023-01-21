var express = require('express');
var router = express.Router();
const moment=require("moment")
const multer  = require('multer')
const upload = multer({dest: "public/uploads/"})
const {ObjectId} = require('mongodb');
const path=require("path")
const fs=require("fs")

const adminAuth=(req, res, next)=>{
  next()
}
/* GET users listing. */
router.get('/', adminAuth, function(req, res, next) {
  res.render("admin", {moment})
});
router.get('/general', adminAuth, async (req, res, next)=> {
  let ret =  await req.db.collection('general').findOne({id:"facts"})
  res.json(ret?ret.value:{})
});
router.post('/general', adminAuth, async (req, res, next)=> {
  let ret =  await req.db.collection('general').findOne({id:"facts"})
  if(!ret)
  {
    ret = await req.db.collection('general').insertOne( {id:"facts", value:req.body});
  }
   ret = await req.db.collection('general').replaceOne({id:"facts"}, {id:"facts", value:req.body});
  res.json(ret)
});
router.post('/uploadFile',upload.single('card'), async (req, res, next)=> {
  if (req.file) {
    req.file.originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf8')
    req.file.date=new Date();
    let ext=path.extname(req.file.originalname)
    console.log(ext);
    await req.db.collection('files').insertOne(req.file);
    res.json("/uploads/"+req.file.filename)
  }
  else res.sendStatus(404)

});
router.post('/videoAdd',adminAuth, async (req, res, next)=> {

  let item={
    id:moment().unix(),
    YTlink:"",
    imageLink:"",
    isActive:false,
    isDeleted:false,

  }
  await req.db.collection('videos').insertOne(item);
  res.json(item)
});
router.get('/videos',adminAuth, async (req, res, next)=> {
  let r=await req.db.collection('videos').find({isDeleted:false},{sort: { id: 1 },}).toArray();
  r=r.reverse()
  res.json(r)
});
router.post('/video',adminAuth, async (req, res, next)=> {

  let find={id:req.body.id}
  if(req.body._id)
    find={_id:ObjectId(req.body._id)}

  delete req.body._id;

  let r=await req.db.collection('videos').updateOne(find,{$set: req.body});

  res.json(r)
});



router.post('/addService',adminAuth, async (req, res, next)=> {
  let item={
    id:moment().unix(),
    title:"",
    isActive:false,
    isDeleted:false,
    items:[]
  }
  let r=await req.db.collection(req.body.section).insertOne(item);
  item._id=r.insertedId;
  res.json(item);
});

router.get('/service/:section',adminAuth, async (req, res, next)=> {
  let r=await req.db.collection(req.params.section).find({isDeleted:false},{sort: { id: 1 },}).toArray();
  r=r.reverse()
  res.json(r)
});


router.post('/saveService/',adminAuth, async (req, res, next)=> {
  let find={_id:ObjectId(req.body.item._id)}
  delete req.body.item._id;
  let r=await req.db.collection(req.body.section).updateOne(find,{$set: req.body.item});

  return res.json(r)
});




module.exports = router;
