const mongoose = require("mongoose")


const commentSchmea = new mongoose.Schema({
    content:{
        type:String,
        required:true,

    },

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },

    postId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Post",
  required: true
},


createdAt:{
 type:Date,
 default: Date.now(),
},


})



const Comment = mongoose.model('Comment',commentSchmea);


module.exports = Comment;


