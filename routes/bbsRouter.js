

var express = require('express');
var router = express.Router();
var app = require("../app")
var schemas = require("../schemas/schema");
/**
 * 获取帖子列表
 * 
 * 需要参数
 *     {
 *          noteName:
 *     }
 *  response:
 {
    "result": true,
    "noteList": [
        {
            "commentList": [
                {
                    "_id": "5b096d11840a0f3ac4a18cbe",
                    "userId": {
                        "_id": "5b096c5e840a0f3ac4a18cbc",
                        "userName": "rose",
                        "imgUrl": "./assets/imgs/user3.png"
                    },
                    "toUserId": {
                        "_id": "5b096a4f840a0f3ac4a18cb6",
                        "userName": "jack",
                        "imgUrl": "./assets/imgs/user2.png"
                    },
                    "des": "is this book? (!img[static/imgs/pic1.jpg])",
                    "noteId": "5b096baa840a0f3ac4a18cb9",
                    "stars": 10
                }
            ],
            "_id": "5b096baa840a0f3ac4a18cb9",
            "title": "my best book is this!",
            "des": "c++ primary!!!hahaha",
            "subject": "{ _id: 5b096b46840a0f3ac4a18cb8, name: 'learn more !' }"
        }
    ],
    "des": "success getList"
}
*/
router.post('/searchNoteList', function (req, res, next) {

    let params = req.body;
    if (params == null || params.noteName == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no noteName"
        })
    } else {

        schemas.noteModel.find({ title: { $regex: params.noteName, $options: 'i' } }).populate({
            path: "subject",
            model: 'subjectTable',
            select: "name"

        }).populate({
            path: "userId",
            model: 'userTable',
            select: "userName imgUrl"
        }).populate(
            {
                path: "commentList",
                model: 'CommentTable',
                populate: {
                    path: "userId toUserId",
                    model: 'userTable',
                    select: "userName imgUrl"
                }
            }
        ).
            exec(function (error, results) {
                if (error) {
                    res.json({
                        result: true,
                        noteList: results,
                        des: error.message
                    })
                } else {
                    res.json({
                        result: true,
                        noteList: results,
                        des: "success getList",
                    })
                }
            })
    }
})
/**
 * 获取帖子详情
 * request:
 * {
 *          noteId:
 * 
 * }
 * {
    "result": true,
    "noteDetail": {
        "commentList": [
            {
                "_id": "5b096d11840a0f3ac4a18cbe",
                "userId": {
                    "_id": "5b096c5e840a0f3ac4a18cbc",
                    "userName": "rose",
                    "imgUrl": "./assets/imgs/user3.png"
                },
                "toUserId": {
                    "_id": "5b096a4f840a0f3ac4a18cb6",
                    "userName": "jack",
                    "imgUrl": "./assets/imgs/user2.png"
                },
                "des": "is this book? (!img[static/imgs/pic1.jpg])",
                "noteId": "5b096baa840a0f3ac4a18cb9",
                "stars": 10
            }
        ],
        "_id": "5b096baa840a0f3ac4a18cb9",
        "title": "my best book is this!",
        "des": "c++ primary!!!hahaha",
        "subject": "{ _id: 5b096b46840a0f3ac4a18cb8, name: 'learn more !' }"
    },
    "des": "success getList"
}
*/
router.post('/getNoteDetail', function (req, res, next) {
    let params = req.body;
    if (params == null || params.noteId == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no noteId"
        })
    } else {

        schemas.noteModel.findOne({ _id: params.noteId }).populate({
            path: "subject",
            model: 'subjectTable',
            select: "name"

        }).populate(
            {
                path: "commentList",
                model: 'CommentTable',
                populate: {
                    path: "userId toUserId",
                    model: 'userTable',
                    select: "userName imgUrl"
                }
            }
        ).populate(
            {
                path: "userId",
                model: 'userTable',
                select: "userName imgUrl"
            }
        ).exec(function (error, results) {
            if (error) {
                res.json({
                    result: false,
                    noteDetail: error.message,
                    des: error.message
                })
            } else {
                res.json({
                    result: true,
                    noteDetail: results,
                    des: "success getList",
                })
            }
        })
    }

})
/**
 * 获取主题列表
 * request:
 * {}
 * response:
 * {
    "result": true,
    "subjectList": [
        {
            "_id": "5b096b46840a0f3ac4a18cb8",
            "name": "learn more !",
            "des": "learning is the best thing in the world",
            "stars": 22
        }
    ],
    "des": "success getList"
}
*/
router.post('/searchSubjects', function (req, res, next) {

    schemas.subjectModel.find({}, function (error, results) {
        if (error) {
            res.json({
                result: false,
                subjectList: error.message,
                des: error.message
            })
        } else {
            res.json({
                result: true,
                subjectList: results,
                des: "success getList",
            })
        }
    })
});
/**
 * 新增主题
 *  {
 *      subject:"name"
 *      des:""
 *  }
 * 
*/
router.post('/insertSubject', function (req, res, next) {
    let params = req.body;
    if (params == null || params.subject == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no subject"
        })
    } else {
        schemas.subjectModel.findOne({ name: params.subject }, function (error, result) {
            if (error) {
                res.json({
                    result: false,
                    des: "already has!"
                })
            } else if (result) {
                res.json({
                    result: false,
                    des: "alread has this subject"
                })

            } else {
                //保存主题
                let thisSubjectModel = new schemas.subjectModel({ name: params.subject, des: "", stars: 1 });
                thisSubjectModel.save(function (err, subjectTosave) {
                    if (err) {
                        res.json({
                            result: false,
                            des: "no subject"
                        })
                    } else {
                        res.json({
                            result: true,
                            des: "successfully added ",
                            newSubject: subjectTosave
                        })
                    }
                });
            }
        })
    }
});


/**
 * 发表评论
 * {
 *      noteId:
 *      toUserId:
 *      userId:
 *      des:
 * }
*/
router.post('/commentToNote', function (req, res, next) {

    let params = req.body;
    if (params == null || params.noteId == undefined || params.des == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no userId or noteId or des"
        })
    } else {
        let newComment = new schemas.commentModel({
            userId: params.userId,
            toUserId: params.toUserId == undefined ? params.userId : params.toUserId,
            des: params.des,
            noteId: params.noteId,
            stars: 0,
        });
        newComment.save(function (cerror, thisnewComment) {
            if (cerror) {
                res.json({
                    result: false,
                    des: cerror.message,
                });
            } else if (thisnewComment) {
                schemas.noteModel.findOneAndUpdate({ _id: params.noteId }, { $push: { commentList: thisnewComment._id } }).then((result) => {
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
            } else {
                res.json({
                    result: false,
                    des: "save failed",
                });
            }

        })





    }
})



/**
 * 上传图片
 * 
 * 
*/
router.post('/submitImg', function (req, res, next) {


})


/**
 * 发表帖子
 * {
 *  userId:
 *  title:
 *  des:
 *  subjects:
 * }
 * 
*/
router.post('/submitNote', function (req, res, next) {
    let params = req.body;
    if (params == null || params.userId == undefined || params.des == undefined || params.subjects == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no userId or title or des"
        })
    } else {
        //
        let newNoteModel = new schemas.noteModel({
            title: params.title,
            userId: params.userId,
            des: params.des,
            subject: [...params.subjects],
            commentList: [],
            stars: 0
        });
        newNoteModel.save(function (cerror, thisNoteModel) {
            if (cerror) {
                res.json({
                    result: false,
                    des: cerror.message,
                });
            } else {
                res.json({
                    result: true,
                    des: "node submit successful",
                });
            }

        })

    }

})



/**
 * 
 * {
 *  userId:
 *  des:
 * 
 * }
 * 
 * 
*/
router.post('/messageBox', function (req, res, next) {
    let params = req.body;
    if (params == null || params.userId == undefined || params.des == undefined) {
        res.json({
            result: false,
            struct: [],
            des: "no userId or des "
        })
    } else {
        //
        let newMessageboxModel = new schemas.messageboxModel({
            userId: params.userId,
            des: params.des
        });
        newMessageboxModel.save(function (cerror, thisMessageModel) {
            if (cerror) {
                res.json({
                    result: false,
                    des: cerror.message,
                    newMsg: null
                });
            } else {
                //
                schemas.messageboxModel.findOne({ _id: thisMessageModel._id }).populate({
                    path: "userId",
                    model: 'userTable',
                    select: "userName imgUrl"
                }
                //去找到这个完整的信息
                ).exec(function(err,results){
                        if(err){
                            res.json({
                                result: false,
                                des: err.message,
                                newMsg: null
                            });
                        }else {
                            //找到了
                            res.json({
                                result: true,
                                des: "successfully",
                                newMsg: results
                            });

                        }


                })
            }

        })

    }

})
/**
 * 获取聊天信息
 * request:{
 *  lastId:
 *  type:
 *  
 * }
 * 
 * 
*/
router.post('/getMessageBox', function (req, res, next) {
    let params = req.body;
    if (params == null || params.lastId == undefined) {
        res.json({
            result: false,
            messageList: [],
            des: "no lastTime  "
        })
    } else {
        //
        if (params.lastId === "") {
            schemas.messageboxModel.find({
                //全部取，无条件
            }).populate({
                path: "userId",
                model: 'userTable',
                select: "userName imgUrl"
            }).sort({
                _id: 1
            }).exec(function(error,results){
                if(error){
                    res.json({
                        result: false,
                        messageList: [],
                        des:  error.message
                    });
                }else{
                    res.json({
                        result: true,
                        messageList: results,
                        des:  "successfully"
                    });
                }
            });
        } else {
            schemas.messageboxModel.find({
                _id: { $gt: params.lastId } //比最后一次id大
            }).populate({
                path: "userId",
                model: 'userTable',
                select: "userName imgUrl"
            }).sort({
                _id: 1 //升序
            }).then(function (result) {
                if (result) {
                    res.json({
                        result: true,
                        messageList: result,
                        des: "successfully"
                    });
                }


            }, function (error) {
                if(error){
                    res.json({
                        result: false,
                        messageList: [],
                        des:  error.message
                    });
                }


            })

        }



    }

})

module.exports = router;