const userModel = require("../User/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PVT_KEY = "feedback"; // ✅ JWT secret

const login = (req, res) => {
  let validation = [];

  if (!req.body.email) validation.push("Email is required");
  if (!req.body.password) validation.push("Password is required");

  if (validation.length > 0) {
    return res.status(422).json({
      success: false,
      message: validation
    });
  }

  userModel.findOne({ email: req.body.email }).then((userData) => {
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    const result = bcrypt.compareSync(req.body.password, userData.password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // JWT payload should include _id to match the middleware
  const payload = {
  _id: userData._id,           // ✅ Required
  name: userData.name,
  email: userData.email,
  userType: userData.userType
};


    const token = jwt.sign(payload, PVT_KEY, { expiresIn: "24h" });

    return res.status(200).json({
      success: true,
      message: "Login successfully!",
      token: token,
      userId: userData._id,      // for frontend use
      name: userData.name,
      userType: userData.userType,
      data: userData
    });
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  });
};

const changePassword = async (req, res) => {
  try {
    let validation = [];

    if (!req.body.oldPassword) validation.push("Old Password is required");
    if (!req.body.newPassword) validation.push("New Password is required");
    if (!req.body.confirmPassword) validation.push("Confirm Password is required");

    if (validation.length > 0) {
      return res.status(422).json({
        success: false,
        message: validation
      });
    }

    // ✅ Fix: get user id from req.user
    const userId = req.user._id;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "No user found!"
      });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    const isMatch = await bcrypt.compare(req.body.oldPassword, userData.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    userData.password = await bcrypt.hash(req.body.newPassword, 10);
    await userData.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (err) {
    console.error("Change Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message
    });
  }
};


module.exports = { login, changePassword };
