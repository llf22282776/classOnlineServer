

var application = require("../app")
var mongoose = require('mongoose');


mongoose.connect('mongodb://classOnline_rw:classOnline_rw@localhost:27017/classOnline',{
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  },function(error){
    
    if(error){
        console.log(error);
        process.exit();
    }
  });


var db = mongoose.connection;

db.once('open', function () {
    // we're connected!
    console.log("connected")
});

var Schema = mongoose.Schema;
//--------------课程--------------
var chapterSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    index: { type: Number },
    classId: { type: mongoose.SchemaTypes.ObjectId ,ref:'classTable'},
    des: { type: String },
    name: { type: String },
    subChapters:[{type:mongoose.SchemaTypes.ObjectId,ref:"subChapterTable"}],
   

},{ collection: 'chapterTable' });
var chapterModel = mongoose.model('chapterTable', chapterSchema);

var subChapterSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    des: { type: String },
    name: { type: String },
    chapterId: { type: mongoose.SchemaTypes.ObjectId,ref : 'chapterTable' },
},{ collection: 'subChapterTable' });
var subChapterModel = mongoose.model('subChapterTable', subChapterSchema);

var videoCommentSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    userId: { type: mongoose.SchemaTypes.ObjectId },
    des: { type: String },
    stars: { type: Number },
    videoId: { type: mongoose.SchemaTypes.ObjectId,ref : "videoTable" },
},{ collection: 'videoCommentTable' });
var videoCommentModel = mongoose.model('videoCommentTable', videoCommentSchema);


var videoSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    views: { type: Number },
    stars: { type: Number },
    url: { type: String },
    name: { type: String },
    shortcut:{type: String},
    classId: { type: mongoose.SchemaTypes.ObjectId ,ref:"classTable"},
    videoCommentsId:[{ type: mongoose.SchemaTypes.ObjectId ,ref:"videoCommentTable"}]
},{ collection: 'videoTable' });
var videoModel = mongoose.model('videoTable', videoSchema);


var classSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    videos: { type: Number },
    stars: { type: Number },
    name: { type: String },
    des: { type: String },
    imgUrl:{type:String},
    chapters:[{type:mongoose.SchemaTypes.ObjectId,ref:"chatperTable"}]
},{ collection: 'classTable' });


classSchema.statics.findAllClass = function(callback){
    return this.find({},callback);
}
classSchema.statics.findClassById  = function(id,callback){
    return this.findOne({_id:id},callback);



}
var classModel = mongoose.model('classTable', classSchema);
//--------------课程--------------

//-------bbs--------

var imgSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    userId: { type: mongoose.SchemaTypes.ObjectId },
    url: { type: String },
    des: { type: String },

},{ collection: 'imgTable' });
var imgModel = mongoose.model('imgTable', imgSchema);


var messageboxSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    userId: { type: mongoose.SchemaTypes.ObjectId ,ref:"userTable"},
    des: { type: String },

},{ collection: 'MessageBoxTable' });
var messageboxModel = mongoose.model('MessageBoxTable', messageboxSchema);

var noteSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    des: { type: String },
    title: { type: String },
    subject: [{ type: String }],
    stars:{ type: Number },
    userId:{type: mongoose.SchemaTypes.ObjectId,ref:"userTable"},
    commentList:[{type: mongoose.SchemaTypes.ObjectId,ref:"CommentTable"}]

},{ collection: 'noteTable' });

var noteModel = mongoose.model('noteTable', noteSchema);


var commentSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    userId: { type: mongoose.SchemaTypes.ObjectId },
    toUserId: { type: mongoose.SchemaTypes.ObjectId },
    des: { type: String },
    stars: { type: Number },
    noteId: { type: mongoose.SchemaTypes.ObjectId },
},{ collection: 'CommentTable' });
var commentModel = mongoose.model('CommentTable', commentSchema);


var subjectSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    des: { type: String },
    name: { type: String },
    stars: { type: Number },
},{ collection: 'subjectTable' });
var subjectModel = mongoose.model('subjectTable', subjectSchema);

//-------bbs--------

var userSchema = new Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId ,auto:true},
    userName: { type: String },
    password: { type: String },
    imgUrl: { type: String },
},{ collection: 'userTable' });
userSchema.statics.findLoginUser = function (name, password, callback) {
    console.log(this);
    return this.findOne({ userName: name,password:password }, callback);
}
userSchema.methods.register = function (name, password,imgUrl, callback) {
    console.log(this);
    return this.model("userTable").save({ userName: name,password:password,imgUrl:imgUrl }, callback);
}
var userModel = mongoose.model('userTable', userSchema);




module.exports = {
    chapterSchema: chapterSchema,
    classSchema: classSchema,
    imgSchema: imgSchema,
    messageboxSchema: messageboxSchema,
    noteSchema: noteSchema,
    subChapterSchema: subChapterSchema,
    commentSchema: commentSchema,
    subjectSchema: subjectSchema,
    userSchema: userSchema,
    videoCommentSchema: videoCommentSchema,
    videoSchema: videoSchema,
    userModel: userModel,
    classModel:classModel,
    chapterModel:chapterModel,
    subChapterModel:subChapterModel,
    videoModel:videoModel,
    videoCommentModel:videoCommentModel,

    imgModel:imgModel,
    messageboxModel:messageboxModel,
    subjectModel:subjectModel,
    commentModel:commentModel,
    noteModel:noteModel,


    
};
