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


module.exports = { login };
