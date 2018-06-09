var express = require('express');
var router = express.Router();
var app = require("../app")
var schemas = require("../schemas/schema");
var constants = require("../util/Constants");
var spliteDes = constants[2];//第三个函数

/**
 * 处理课程学习
 * 
*/
/* getAllClassList. 获得所有的课程列表 */
/**
 * request: none
 * respones:
{
    "result": true,
    "list": [
        {
            "chapters": [
                "5b09678e840a0f3ac4a18cb1"
            ],
            "_id": "5b0966f2840a0f3ac4a18cb0",
            "name": "c language",
            "des": "best programming language!",
            "videos": 3,
            "stars": 24
             imgUrl:"/static/imgs/card-saopaolo.png"
        }
    ],
    "des": "success"
}
 * 
 */
router.post('/getAllClassList', function (req, res, next) {
    let params = req.body;
    schemas.classModel.findAllClass(function (error, results) {
        if (error) {
            res.json({
                result: false,
                list: [],
                des: error
            })

        } else {
            console.log("getAll")
            res.json({
                result: true,
                list: results,
                des: "success"
            })

        }
    });

});

/* getClassStruct. 获得一个课程的结构，从视频列表的右上角进入*/

/**
 * request: {classId:}  课程的Id
 * respones:
{
    "result": true,
    "classStruct": {
        "chapters": [
            {
                "subChapters": [
                    {
                        "_id": "5b096926840a0f3ac4a18cb2",
                        "name": "first subChapter",
                        "des": "how to use ide",
                        "chapterId": "5b09678e840a0f3ac4a18cb1"
                    }
                ],
                "_id": "5b09678e840a0f3ac4a18cb1",
                "index": 1,
                "classId": "5b0966f2840a0f3ac4a18cb0",
                "des": "how to write hello world programm",
                "name": "first chapter"
            }
        ],
        "_id": "5b0966f2840a0f3ac4a18cb0",
        "name": "c language",
        "des": "best programming language!",
        "videos": 3,
        "stars": 24,
        "imgUrl": "/static/imgs/card-saopaolo.png"
    }
}
 * 
*/
router.post('/getClassStruct', function (req, res, next) {
    let params = req.body;
    if (params == null || params.classId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no class Id"
        })
    } else {
        schemas.classModel.findOne({ _id: params.classId }).populate({
            path: "chapters",
            model: 'chapterTable',
            populate: {
                path: 'subChapters',
                model: 'subChapterTable',

            }
        }).exec(function (error, results) {
            res.json({
                result: true,
                classStruct: results
            })

        })





    }



});

/**
 * getVideoDetails:获取一个视频播放页面的详情,从视频列表进入
 * 
 * request:{
 *     videoId:
 *    
 * }
 * respones:
 {
    "result": true,
    "videoDetail": {
        "videoCommentsId": [
            {
                "_id": "5b096aa5840a0f3ac4a18cb7",
                "userId": {
                    "_id": "5b096a4f840a0f3ac4a18cb6",
                    "userName": "jack",
                    "imgUrl": "./assets/imgs/user2.png"
                },
                "videoId": "5b096955840a0f3ac4a18cb3",
                "des": "Woooooooo,amazing!",
                "stars": 14
            }
        ],
        "_id": "5b096955840a0f3ac4a18cb3",
        "name": "write program",
        "url": "static/videos/video_1.mp4",
        "views": 16,
        "stars": 33,
        "classId": "5b0966f2840a0f3ac4a18cb0"
    }
}
 * 
*/
router.post('/getVideoDetails', function (req, res, next) {
    let params = req.body;
    if (params == null || params.videoId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no video Id"
        })
    } else {
        schemas.videoModel.findOne({ _id: params.videoId }).populate({
            path: "videoCommentsId",
            model: 'videoCommentTable',
            populate: {
                path: 'userId',
                model: 'userTable',
                select: "userName imgUrl"

            }
        }).exec(function (error, results) {
            res.json({
                result: true,
                videoDetail: results
            })
        })
    }

});
/**
 * 搜索获取获取videoList,点击进入课程列表的时候
 * request:{
 *  videoName:"",
 *  classId:""
 *  
 * }
 * response:{
    "result": true,
    "videoList": [
        {
            "videoCommentsId": [
                {
                    "_id": "5b096aa5840a0f3ac4a18cb7",
                    "userId": {
                        "_id": "5b096a4f840a0f3ac4a18cb6",
                        "userName": "jack",
                        "imgUrl": "./assets/imgs/user2.png"
                    },
                    "videoId": "5b096955840a0f3ac4a18cb3",
                    "des": "Woooooooo,amazing!",
                    "stars": 14
                }
            ],
            "_id": "5b096955840a0f3ac4a18cb3",
            "name": "write program",
            "url": "static/videos/video_1.mp4",
            "views": 16,
            "stars": 33,
            "classId": "5b0966f2840a0f3ac4a18cb0"
        }
    ]
}
 * 
*/
router.post('/searchVideos', function (req, res, next) {
    let params = req.body;
    if (params == null || params.videoName == undefined || params.classId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no viedoName  or classId"
        })
    } else {
        schemas.videoModel.find({ classId: params.classId, name: { $regex: params.videoName, $options: 'i' } }).populate({
            path: "videoCommentsId",
            model: 'videoCommentTable',
            populate: {
                path: 'userId',
                model: 'userTable',
                select: "userName imgUrl"

            }
        }).sort({}).exec(function (error, results) {
            res.json({
                result: true,
                videoList: results
            })
        })
    }

});




/**
 * 
 * 发表评论
 * request:{
 *  userId:
 *  des:
 *  videoId:
 * 
 * }
 * 
 * 
*/
router.post('/commentToVideo', function (req, res, next) {
    let params = req.body;
    if (params == null || params.userId == undefined || params.des == undefined || params.videoId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no des  or userId no videoId"
        })
    } else {
        let thisComentModel = new schemas.videoCommentModel({ userId: params.userId, videoId: params.videoId, des: params.des, stars: 1 });
        thisComentModel.save(function (error, newComment) {
            if (error) {
                res.json({
                    result: false,
                    des: error.message,
                });
            } else {

                schemas.videoModel.findOneAndUpdate({ _id: params.videoId }, { $push: { videoCommentsId: newComment._id } }).then((result) => {
                    if (result) {
                        res.json({
                            result: true,
                            des: "comment successfully!",
                        });
                    }

                }).catch((error) => {
                    res.json({
                        result: false,
                        des: error.message,
                    });


                });
                //还得更新video


            }
        })
    }
});

/**
 * 
 * 获取新的课程结果
 * 
 * 
*/
/**/
router.post('/getClassNewStruct', function (req, res, next) {
    let params = req.body;
    if (params == null || params.classId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no class Id"
        })
    } else {
        schemas.classModel.findOne({ _id: params.classId }).populate({
            path: "chapters",
            model: 'chapterTable',
            select: "_id name classId index imgUrl"
        }).exec(function (error, results) {
            /**
             * 
             * des
             * name
             * chapters:{
             *      _id:
             *      name:
             *      des:
             *      index:
             *      //imgUrl:章节内容第一个图片或者视频的第一帧
             * }
             * 而章节的详细信息，留着从detail里面获得
             * 
            */
            if (error) {
                //出错了
                res.json({
                    result: false,
                    des: error.message,
                    classStruct: results
                });
            } else if (results) {
                res.json({
                    result: true,
                    classStruct: results,
                    des: ""
                })

            }



        })





    }



});

/**
 * 获取结构化的章节
 * request:{
 *  chapterId
 * }
 * 
*/
router.post('/getChapterDetail', function (req, res, next) {
    let params = req.body;
    if (params == null || params.chapterId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no chapterId"
        })
    } else {
        schemas.chapterModel.findOne({ _id: params.chapterId }).sort({ index: 1 }).exec(function (error, results) { //正序排序
            /**
             * 
             * _id:
             * name:
             * des:
             * index:
             * 现在要对des进行分割
             *  
            */
            if (error) {
                //出错了
                res.json({
                    result: false,
                    des: error.message,
                    chapterDetail: {}
                });
            } else if (results != undefined) {
                //获得到课程了
                let desLit = spliteDes(results.des);//获得一个分割好的字符串
                let response = {
                    result: true,
                    des: "success",
                    chapterDetail: {
                        _id: results._id,
                        name: results.name,
                        index: results.index,
                        desList: desLit

                    }

                }

                res.json(response);


            } else {
                let response = {
                    result: false,
                    des: "null",
                    chapterDetail: {}
                }
                res.json(response);

            }

        })
    }
});

/**
 * 
 * 获取课程的list
 * 
*/
router.post('/getAllClassNames', function (req, res, next) {
    let params = req.body;
    schemas.classModel.find({}, "name _id", (error, results) => {

        if (error) {
            res.json({
                result: false,
                list: [],
                des: error.message
            })

        } else {
           
            res.json({
                result: true,
                list: results,
                des: "success"
            })

        }
    });

})


/**
 * 
 * 点赞功能
 * request:
 * {
 *      userId:
 *      starsTarget: video/videoComment/note/noteComment/class
 *      type:
 *      id:
 *  
 * }
 * 
*/
router.post('/supportThis', function (req, res, next) {

    let params = req.body;
    //定义匿名函数
    console.log(params)
    if (params == null || params.userId == undefined || params.type == undefined || params.starsTarget == undefined || params.id == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no userId or type or id or starsTarget"
        })
    } else {
        let type =params.type ;
        let insert_OneSupport = function(model){
            model.save(function(errorSaveModel,savedModel){
                if(errorSaveModel){
                    res.json({
                        result: false,
                        des: errorSaveModel.message,
                        state:0,
                    })
                }else {
                    //保存成功了，写入成功了
                    res.json({
                        result: true,
                        des: "successfully",
                    })
                }
            })

        }
        let callback_increment = function(error_,result_){
            if(error_){
                //增长表里面的stars后
                res.json({
                    result: false,
                    des: error_.message,
                    state:0
                })
            }else {
                //保存一个记录
                let modelToSave =new schemas.supportoModel({
                    userId: params.userId,
                    starsTarget: params.starsTarget,
                    videoId: params.id,
                    noteId: params.id,
                    commentId: params.id,
                    videoCommentId:params.id,
                    classId: params.id,
                }); 
                insert_OneSupport(modelToSave);

            }
        }
        let callBack_support = function(error,result,starsTarget){
            if(error){
                res.json({
                    result: false,
                    des: error.message,
                    state:0 //出错
                })
            }else if(result){
                //有
                res.json({
                    result: false,
                    des: "already has support record",
                    state:1 //已经有了
                })
            }else {
                //没有,就写入
                if(starsTarget === "video"){
                    schemas.videoModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:1}}).exec(function(error_,result_){
                        //更改video 表
                        callback_increment(error_,result_);
                    })

                }else if(starsTarget === "note"){
                    schemas.noteModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:1}}).exec(function(error_,result_){
                        callback_increment(error_,result_);
                    })

                }else if(starsTarget === "noteComment"){
                    schemas.commentModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:1}}).exec(function(error_,result_){
                        callback_increment(error_,result_);
                    })

                }else if(starsTarget === "videoComment"){
                    schemas.videoCommentModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:1}}).exec(function(error_,result_){
                        callback_increment(error_,result_);
                    })

                }else if(starsTarget === "class"){
                    schemas.classModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:1}}).exec(function(error_,result_){
                        callback_increment(error_,result_);
                    })

                }
               
    
            }
        }
      
        if(type === 'support'){
            //是支持
            //先判断点赞表里面有没有
            if(params.starsTarget === "video"){
                schemas.supportoModel.findOne({userId:params.userId,starsTarget:params.starsTarget,videoId:params.id}).exec((error,result)=>{
                  callBack_support(error,result,params.starsTarget);
                })

            }else if(params.starsTarget === "videoComment"){
                schemas.supportoModel.findOne({userId:params.userId,starsTarget:params.starsTarget,videoCommentId:params.id}).exec((error,result)=>{
                    callBack_support(error,result,params.starsTarget);
                  })
            }else if(params.starsTarget === "note"){
                schemas.supportoModel.findOne({userId:params.userId,starsTarget:params.starsTarget,noteId:params.id}).exec((error,result)=>{
                    callBack_support(error,result,params.starsTarget);
                  })

            }else if(params.starsTarget === "noteComment"){
                schemas.supportoModel.findOne({userId:params.userId,starsTarget:params.starsTarget,commentId:params.id}).exec((error,result)=>{
                    callBack_support(error,result,params.starsTarget);
                  })

            }else if(params.starsTarget === "class"){
                schemas.supportoModel.findOne({userId:params.userId,starsTarget:params.starsTarget,classId:params.id}).exec((error,result)=>{
                    callBack_support(error,result,params.starsTarget);
                  })

            }
           

        }else if(type == "unSupport"){
            //不再支持
         
            let callback_decrement = function(error_,result_,starsTarget){
                //更新stars的回调函数
                if(error_){
                    res.json({
                        result: false,
                        des: error_.message,
                        state:0
                    })
                }else {
                    //删除成功了
                    res.json({
                        result: true,
                        des: "successfully"
                    })
                }
            }
            let callBack_unSupport = function(error,result,starsTarget){
                if(error){
                    res.json({
                        result: false,
                        des: error.message,
                        state:0
                    })
                }else if(!result){
                    //表里没有,因为现在是
                    res.json({
                        result: false,
                        des: "no support record",
                        state:1
                    })
                }else {
                    //删除support成功了，更新其他表里面的stars
                    if(starsTarget === "video"){
                        schemas.videoModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:-1}}).exec(function(error_,result_){
                            //更改video 表
                            callback_decrement(error_,result_);
                        })
    
                    }else if(starsTarget === "note"){
                        //更新表
                        schemas.noteModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:-1}}).exec(function(error_,result_){
                            callback_decrement(error_,result_);
                        })
    
                    }else if(starsTarget === "noteComment"){
                        console.log("noteComment unSupport")
                        schemas.commentModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:-1}}).exec(function(error_,result_){
                            callback_decrement(error_,result_);
                        })
    
                    }else if(starsTarget === "videoComment"){
                        schemas.videoCommentModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:-1}}).exec(function(error_,result_){
                            callback_decrement(error_,result_);
                        })
    
                    }else if(starsTarget === "class"){
                        schemas.classModel.findByIdAndUpdate({_id:params.id},{$inc:{stars:-1}}).exec(function(error_,result_){
                            callback_decrement(error_,result_);
                        })
    
                    }
                   
        
                }
            }

            if(params.starsTarget === "video"){
                schemas.supportoModel.findOneAndRemove({userId:params.userId,starsTarget:params.starsTarget,videoId:params.id}).exec((error,result)=>{
                    callBack_unSupport(error,result,params.starsTarget);
                })

            }else if(params.starsTarget === "videoComment"){
                schemas.supportoModel.findOneAndRemove({userId:params.userId,starsTarget:params.starsTarget,videoCommentId:params.id}).exec((error,result)=>{
                    callBack_unSupport(error,result,params.starsTarget);
                  })
            }else if(params.starsTarget === "note"){
                schemas.supportoModel.findOneAndRemove({userId:params.userId,starsTarget:params.starsTarget,noteId:params.id}).exec((error,result)=>{
                    callBack_unSupport(error,result,params.starsTarget);
                  })

            }else if(params.starsTarget === "noteComment"){
                schemas.supportoModel.findOneAndRemove({userId:params.userId,starsTarget:params.starsTarget,commentId:params.id}).exec((error,result)=>{
                    callBack_unSupport(error,result,params.starsTarget);
                  })

            }else if(params.starsTarget === "class"){
                schemas.supportoModel.findOneAndRemove({userId:params.userId,starsTarget:params.starsTarget,classId:params.id}).exec((error,result)=>{
                    callBack_unSupport(error,result,params.starsTarget);
                  })

            }
        }

    }




})


/**
 * 
 * 增加观看次数,点进去视频页面的时候才是
 * request:
 * {
 *      userId:
 *      videoId: 
 *  
 * }
 * 
*/
router.post('/Insertviews', function (req, res, next) {

    let params = req.body;
    if (params == null || params.userId == undefined ||  params.videoId == undefined) {
        res.json({
            result: false,
            des: "no userId or videoId "
        })
    } else {
        //更新
        schemas.videoModel.findByIdAndUpdate({_id:params.videoId},{$inc:{views:1}}).exec((error,result)=>{
            if(error){
                res.json({
                    result: false,
                    des: error.message
                })
            }else {
                res.json({
                    result: true,
                    des: "inc views successfully"
                })

            }
          })

    }




})

module.exports = router;
