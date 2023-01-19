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
router.get('/generel', adminAuth, async (req, res, next)=> {
  let r = await app.db.collection('menu')
  res.json(r)
});

module.exports = router;
