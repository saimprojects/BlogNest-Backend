const express = require("express");
const {getAllComment,createComment,getAllUsersComments,deleteComment} =  require("../controller/comment")
const {jwtAuthMiddleware} = require("../middleware/authmiddelware")
const router = express.Router();



router.post('/createcomment',jwtAuthMiddleware,createComment)
router.get('/getcomment/:postId',getAllComment);
router.get("/getAllUsersComments",getAllUsersComments);
router.delete("/deleteComment/:id",deleteComment);



module.exports = router;