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
  let cursor =  req.db.collection('general').find();
  if(r._eventsCount==0){
    let r = await req.db.collection('general').insertMany([{id:"projectCount",value:0}])
    cursor =  req.db.collection('general').find();
  }

  res.json(cursor)
});

module.exports = router;
