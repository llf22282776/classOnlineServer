var express = require('express');
var router = express.Router();
var app = require("../app")
var schemas = require("../schemas/schema");
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
        }
    ],
    "des": "success"
}
 * 
 */
router.post('/getAllClassList', function (req, res, next) {
    let params  =req.body;
    schemas.classModel.findAllClass(function(error,results){
        if(error){
            res.json({
                result:false,
                list:[],
                des:error
            })

        }else {
            res.json({
                result:true,
                list:results,
                des:"success"
            })

        }
    });

});

/* getClassStruct. 获得一个课程的结构，其中视频章节的url也在里面*/

/**
 * request: {classId:}  课程的Id
 * respones:
{
    "result": true,
    "list": [
        {
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
                    "name": "first chapter",
                    "videoId": "5b096955840a0f3ac4a18cb3"
                }
            ],
            "_id": "5b0966f2840a0f3ac4a18cb0",
            "name": "c language",
            "des": "best programming language!",
            "videos": 3,
            "stars": 24
        }
    ]
}
 * 
*/
router.post('/getClassStruct', function (req, res, next) {
    let params  =req.body;
    if(params == null || params.classId == undefined){
        res.json({
            result:false,
            struct:[],
            des:"no class Id"
        })
    }else {
        schemas.classModel.find({_id:params.classId}).populate({
            path:"chapters",
            model:'chapterTable',
            populate:{
                path:'subChapters',
                model:'subChapterTable',
                populate:{
                    path:'videoId',
                    model:'videoTable',
                }
            }
        }).exec(function(error,results){
            res.json({
                result:true,
                list:results
            })

        })
       


       

    }



});

/**
 * getVideoDetails:获取一个视频播放页面的详情
 * 
 * request:{
 *     videoId:
 * }
 * respones:
 {
    "result": true,
    "list": [
        {
            "videoCommentsId": [
                {
                    "_id": "5b096aa5840a0f3ac4a18cb7",
                    "userId": {
                        "_id": "5b096a4f840a0f3ac4a18cb6",
                        "userName": "jack",
                        "imgUrl": "assests/imgs/user1.jpg"
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
            "chapterId": "5b09678e840a0f3ac4a18cb1"
        }
    ]
}
 * 
 * 
 * 
 * }
 * 
*/
router.post('/getVideoDetails', function (req, res, next) {
    let params  =req.body;
    if(params == null || params.videoId == undefined){
        res.json({
            result:false,
            struct:[],
            des:"no video Id"
        })
    }else {
        schemas.videoModel.find({_id:params.videoId}).populate({
            path:"videoCommentsId",
            model:'videoCommentTable',
            populate:{
                path:'userId',
                model:'userTable',
                select:"userName imgUrl"
           
            }
        }).exec(function(error,results){
            res.json({
                result:true,
                list:results
            })
        })
    }

});
/**/
module.exports = router;
