var express = require('express');
var router = express.Router();
var app = require("../app")
var schemas = require("../schemas/schema");
/* login */
router.post('/login', function(req, res, next) {
    let params  =req.body;
    console.log(params.userName +" "+params.password );
    if(params.userName == undefined|| params.password == undefined){
      
      res.json({
        result:false,
        des:"username or password is empty"
      });
    }else {
      //查询
      schemas.userModel.findLoginUser(params.userName,params.password,function(error,result){
        if(error || result == null){
          res.json({
            result:false,
            des:error?error:"no such user",
          });
        }else {
          //成功了,添加一个cookie
          res.cookie('userId', result._id, {  path: '/',signed:true});
          res.json({
            result:true,
            des:"success login!",
            imgUrl:result.imgUrl,
            user:result,
          });
        }
       
      })
     
    }
});


router.post('/register', function(req, res, next) {
  let params  =req.body;
  console.log(params.userName +" "+params.password );
  if(params.userName == undefined|| params.password == undefined || params.imgUrl == undefined){
      
    res.json({
      result:false,
      des:"username or password or  imgUrl is empty"
    });
  }else {
    //查询
    var userModel = new schemas.userModel({ userName: params.userName,password:params.password,imgUrl:params.imgUrl });
    userModel.save(function(error,result){
      if(error){
        res.json({
          result:false,
          des:error,
        });
      }else {
    
        res.json({
          result:true,
          des:"success register",
          
        });
      }
     
    })

   
  }

});

module.exports = router;

