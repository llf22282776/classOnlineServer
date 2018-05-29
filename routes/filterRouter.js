var express = require('express');
var url = require("url");
var constans= require("../util/Constants")

/* 过滤没有cookie的 */
router  = function(req, res, next) {
  
    if(req.signedCookies.userId){//有userId
      
      next();
     
    }else {
      if(constans[0](req.path) ==false){
        res.json({
          result:false,
          des:"no cookies"
        });
      }else {
        next();

      }
     
    }
 
  

};

module.exports = router;
//相当于一个controller