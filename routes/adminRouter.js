var express = require('express');
var router = express.Router();
const moment=require("moment")

const adminAuth=(req, res, next)=>{
  next()
}
/* GET users listing. */
router.get('/', adminAuth, function(req, res, next) {
  res.render("admin", {moment})
});
router.get('/general', adminAuth, async (req, res, next)=> {
  let r = await req.db.collection('general').find();
  if(r._eventsCount==0){
    r = await req.db.collection('general').insertMany([{id:"projectCount",value:0}])
  }
  res.json(r)
});

module.exports = router;
