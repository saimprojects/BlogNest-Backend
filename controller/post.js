const Post = require("../models/post");

async function createPost(req, res) {
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      image: req.file.filename,
      author: req.user._id,
    });
    res.status(201).json({
      message: "Post created successfully",
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
      success: false,
    });
  }
}

async function getPosts(req, res) {
  try {
    const posts = await Post.find({}).populate("author");
    res.status(200).json({
      message: "Posts retrieved successfully",
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving posts",

      error: error.message,
    });
  }
}

async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate("author");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({
      message: "Post retrieved successfully",
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving post",
      error: error.message,
    });
  }
}

async function updatePost(req, res) {
  try {
    const updatedData = {
      title: req.body.title,
      content: req.body.content,
    };

    if (req.file) {
      updatedData.image = req.file.filename;
    }
    const post = await Post.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post updated successfully",
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating post",
      error: error.message,
    });
  }
}

async function getmyposts(req, res) {
  try {
    const posts = await Post.find({ author: req.user._id }).populate("author");
    res.status(200).json({
      message: "My posts retrieved successfully",
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving my posts",
      error: error.message,
      success: false,
    });
  }
}

async function deletePost(req, res) {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const userRole = req.user.role;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId && userRole !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Not Authorized to delete this post",
        });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
}

const latestBlogs =  async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(6);
    res.json({posts:posts, success:true , message:"latest post fetch successfully"});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs",success:false });
  }
}

// Search blogs by title or content
const searchBlogs=  async (req, res) => {
  const { query } = req.query;
  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    });
    res.json({posts:posts, success:true,message:"searchBlog fetch successfully"});
  } catch (err) {
    res.status(500).json({ error: "Search failed", success:false });
  }
}
module.exports = {
  createPost,
  getPosts,
  getmyposts,
  getPostById,
  updatePost,
  deletePost,
  latestBlogs,
  searchBlogs
};
