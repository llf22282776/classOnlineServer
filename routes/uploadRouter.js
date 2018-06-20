var express = require('express');
var router = express.Router();
var app = require("../app")
var schemas = require("../schemas/schema");
var constants = require("../util/Constants");
var multer = require('multer')
var upload = multer({ dest: 'public/static/videos' })
var fs = require("fs");
var constants = require("../util/Constants");
var videoRootPath = constants[3];//第四个
//上传video
//里面有什么？？
router.post('/uploadVideo', upload.array("files", 1), function (req, res, next) {
    if (req.body.classId === "" || req.body.classId === undefined ||req.body.name === "" ||req.body.name === undefined  ) {
        //没有
        //删除文件  
        fs.unlink(req.files[0].path, (err) => {
            if (err) {
                res.json({
                    result: false,
                    des: err.message
                })
            } else {
                res.json({
                    result: false,
                    des: 'no classId or name  ,delete  video'
                })
            }


        });
    } else {
        //相当于加入一个video
        let thisVideo = new schemas.videoModel({
            views: 0,
            stars: 0,
            url: videoRootPath + req.files[0].filename,
            name: req.body.name,
            shortcut: "",
            classId: req.body.classId,
            videoCommentsId: []

        })
        thisVideo.save((err, thisVideoToSave) => {
            if (err) {//出错了
                //删除文件  
                fs.unlink(req.files[0].path, (error) => {
                    if (error) {
                        res.json({
                            result: false,
                            des: err.message+" "+error.message
                        })
                    } else {
                        res.json({
                            result: false,
                            des:err.message
                        })
                    }
                });
            }else {
                //更新下class videos
                schemas.classModel.findByIdAndUpdate({_id:req.body.classId},{$inc:{videos:1}}).exec(function(error_,result_){
                    if(error_){
                        fs.unlink(req.files[0].path, (error3) => {
                            if (error3) {
                                res.json({
                                    result: false,
                                    des: error_.message+" "+error3.message
                                })
                            } else {
                                res.json({
                                    result: false,
                                    des:error_.message
                                })
                            }
                        });
                    }else {
                        res.json({
                            result: true,
                            des:"upload successfully",
                            video:thisVideoToSave
                        })
                    }

                })
            }
        });
    }
});


module.exports = router;
//相当于一个controller