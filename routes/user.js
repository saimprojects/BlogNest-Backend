const express = require("express");
const  upload  = require("../middleware/upload");
const {
  createUser,
  loginUser,
  getUserProfile,
  logoutUser,
  verifyOtp,
  resendOtp,
  uploadProfileImage,
  deleteUser,
  allUsers,
  forgotPassword,
  resetPassword

} = require("../controller/user");
const { jwtAuthMiddleware, isAdmin } = require("../middleware/authmiddelware");
// Yeh missing hai
const User = require("../models/user");

const router = express.Router();

router.post("/register", createUser);

router.post("/verify", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgotPassword",forgotPassword);
router.post("/resetPassword/:token",resetPassword)

router.post("/login", loginUser);
router.post(
  "/upload-profile",
  jwtAuthMiddleware,
  upload.single("image"),
  uploadProfileImage
);

router.delete("/delete-user/:id",deleteUser);
router.get("/allUsers",allUsers)
router.get("/profile", jwtAuthMiddleware, getUserProfile);

router.get("/logout", logoutUser);

router.get("/admin", jwtAuthMiddleware, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
    user: req.user,
  });
});

router.get("/me", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // password hide kar do
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

module.exports = router;
