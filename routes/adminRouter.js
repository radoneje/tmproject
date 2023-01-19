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
  let ret =  await req.db.collection('general').findOne({id:"facts"})
  res.json(ret)
});
router.post('/general', adminAuth, async (req, res, next)=> {

  let ret =  await req.db.collection('general').findOne({id:"facts"})
  res.json(ret)
});

module.exports = router;
