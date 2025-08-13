const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { generateToken } = require("../middleware/authmiddelware");
const sendEmail = require("../utils/sendEmail");

  
// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    const user = await User.create({
      name,
      email,
      password,
      otpExpiry,
      otp,
      isVerified: false,
    });

    await sendEmail(
      user.email,
      "Verify your email - OTP",
      `<div>
      <h3>Hi ${user.name},</h3>
      <Your Otp code is:
      <h2 style="color: #007bff;">${otp}</h2>
            <p>Thanks!</p>
      </div> `
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
      success: false,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Email", success: false });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email before logging in",
        unverified: true,
        success: false,
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid password", success: false });
    }

    // Token payload
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Generate JWT token
    const token = generateToken(payload);

    // Set the token in a cookie before sending the response
   res.cookie("token", token, {
  httpOnly: true,       // ✅ prevent JS access
  secure: true,         // ✅ only over HTTPS
  sameSite: "None",     // ✅ allow cross-site requests
  maxAge: 7 * 24 * 60 * 60 * 1000, // optional: 7 days
});

    // ✅ Send response after cookie
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in user",
      error: error.message,
      success: false,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
};

// logout user
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res
    .status(200)
    .json({ message: "User logged out successfully", success: true });
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.otp !== String(otp))
    return res.status(400).json({ message: "Invalid OTP" });

  if (Date.now() > user.otpExpiry) {
    return res.status(400).json({ message: "OTP expired" });
  }

  user.isVerified = true;
  user.otp = null;
  await user.save();

  res.json({ success: true, message: "Email verified" });
};

const resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isVerified) {
    return res.status(400).json({ message: "User is already verified" });
  }

  // Generate new OTP and expiry
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Send Email
  await sendEmail(
    user.email,
    "Resent OTP - Verify your Email",
    `Hi ${user.name},\n\nYour new OTP is: ${otp}\n\nThanks!`
  );

  res.json({ success: true, message: "OTP resent successfully" });
};

const uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const image = req.file?.filename;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: image },
      { new: true }
    );

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User deleted successfully",
      user: deletedUser,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No users found" });
    }

    res.status(200).json({ success: true, allUsers: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const token = generateToken({
      _id: user._id,
      email: user.email,
    });

    const resetLink = `http://localhost:5173/new-password/${token}`;
    

   await sendEmail(
  user.email,
  "Reset your password",
  `
  <div style="font-family: Arial, sans-serif; padding: 10px;">
    <h3>Hi ${user.name},</h3>
    <p>Click the link below to reset your password:</p>
    <p>
      <a href="${resetLink}" style="color: #007bff; text-decoration: none;">
        Reset Password
      </a>
    </p>
    <br>
    <p>If you didn’t request this, you can ignore this email.</p>
    <p>Thanks!</p>
  </div>
  `
);

    res
      .status(200)
      .json({ message: "Password reset link sent to email", success: true });
  } catch (err) {
    res.status(500).json({ message: "server error", success: false });
  }
};

async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET, );
    
    const userId = decoded._id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset error:", err.message);
    res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
}
module.exports = {
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
  resetPassword,
};
