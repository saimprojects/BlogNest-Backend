const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");
const router = express.Router();
const {filterData} = require("../controller/adminStats")
router.get('/total-users', async (req, res) => {
  try {
    const users = await User.countDocuments();
    res.status(200).json({ totalUsers: users, success:true }); // ✅ Corrected
  } catch (err) {
    res.status(500).json({ message: "Server Error", success:false }); // ✅ Corrected
  }
});


router.get("/filterData",filterData);


router.get('/total-posts', async (req, res) => {
  try {
    const posts = await Post.countDocuments();
    res.status(200).json({ totalPosts: posts, success:true }); // ✅ Corrected
  } catch (err) {
    res.status(500).json({ message: "Server Error", success:false }); // ✅ Corrected
  }
});

module.exports = router;
