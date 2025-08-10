const getDateRange = require("../utils/momentDate");
const Comment = require("../models/comments");
const Post = require("../models/post");
const User = require("../models/user");

async function filterData(req, res) {
  const { range } = req.query;

  try {
    const { start, end } = getDateRange(range);

    const comments = await Comment.find({
      createdAt: { $gte: start, $lte: end }
    });

    const posts = await Post.find({
      createdAt: { $gte: start, $lte: end }
    });

    const users = await User.find({
      createdAt: { $gte: start, $lte: end }
    });

    res.status(200).json({
     comments: comments,
     posts: posts,
     users: users,
     success:true
    });

  } catch (err) {
    console.error("server error catach", err.message);
    res.status(500).json({ message: "server error catch", error: err.message  , success:false});
  }
}

module.exports = { filterData };
