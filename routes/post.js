const express = require("express");
const { createPost, getPosts, getPostById, updatePost, deletePost ,getmyposts,searchBlogs,latestBlogs}
= require("../controller/post");
const  upload  = require("../middleware/upload");

const { jwtAuthMiddleware } = require("../middleware/authmiddelware");

const router = express.Router();

// Create a new post
router.post("/", jwtAuthMiddleware,upload.single("image"), createPost);   



//get latest posts
router.get("/latest",latestBlogs)
//get post by search
router.get("/search",searchBlogs)
// Get all posts    
router.get("/", getPosts);

// Get my posts
router.get("/myposts",jwtAuthMiddleware, getmyposts);
// Get a post by ID
router.get("/:id", getPostById);
// Update a post by ID  
router.put("/:id", jwtAuthMiddleware,upload.single('image'), updatePost);
// Delete a post by ID
router.delete("/:id", jwtAuthMiddleware, deletePost);   




module.exports = router;
