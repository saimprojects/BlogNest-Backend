const Comment = require("../models/comments");



async function createComment(req,res){
    try{
const {content,postId} = req.body;


    if(!content || !postId){
        return res.status(400).json({message:'Content and postId are required', success:false});
    }

const comment = await Comment.create({content,author:req.user._id,postId:postId})

res.status(200).json({message:'Comment has been created', success:true })
    }catch(err){
        console.log("Create Comment Error:", err) 
        res.status(500).json({message:"Internal server error", success:false});

    }
    

}



const getAllComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({postId}).populate("author", "name email profileImage");

    res.status(200).json({
      success: true,
     comments: comments,
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

const getAllUsersComments = async (req,res)=>{
  try{
      const comments = await Comment.find({}).populate("author","name email profileImage");
      if(!comments) {
        return res.status(404).json({
        message:"comments not found", success:false,
        })
      }

      res.status(200).json({
        success:true,
        comments,
      })
  }catch(err){
    console.error("Error fetching comments:",err);
    res.status(500).json({
      success:false,
      message:"failed to fetch comments",
    })

  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found",success:false });
    }

    res.status(200).json({ message: "Comment deleted successfully", comment: comment,success:true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


    
module.exports = {
    getAllComment,
    createComment,
    getAllUsersComments,
    deleteComment
}