var express = require('express');
var router = express.Router();
const moment=require("moment")
const multer  = require('multer')
const upload = multer({dest: "public/uploads/"})

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
    await req.db.collection('files').insertOne(file);
    res.json("/uploads/"+req.file.filename)
  }
  else res.sendStatus(404)

});


module.exports = router;
