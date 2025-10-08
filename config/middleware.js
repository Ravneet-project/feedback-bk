// ✅ middleware/auth.js
const jwt = require("jsonwebtoken");

// ✅ Secret key for signing/verifying tokens
const PVT_KEY = "feedback";

module.exports = (req, res, next) => {
  try {
    // ✅ Get authorization header
    const authHeader = req.headers.authorization;

    // ❌ Token missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: "Token not found!",
      });
    }

    // ✅ Extract token (remove 'Bearer ')
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    jwt.verify(token, PVT_KEY, (err, decoded) => {
      if (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(403).json({
          success: false,
          status: 403,
          message: "Unauthorized access! Invalid token.",
        });
      }

      console.log("Decoded Token:", decoded);

      // ✅ Check allowed user types
      if (decoded.userType === 1 || decoded.userType === 2) {
        req.user = decoded;
        req.user._id = decoded._id; // ensure _id is accessible in req.user
        return next();
      }

      // ❌ User type not allowed
      return res.status(403).json({
        success: false,
        status: 403,
        message: "You are not allowed to access this resource.",
      });
    });
  } catch (error) {
    console.error("Middleware Error:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Server error during token validation.",
    });
  }
};
