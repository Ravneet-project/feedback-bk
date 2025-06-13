const jwt = require("jsonwebtoken");
const PVT_KEY = "feedback"; // ✅ Unified secret
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token is missing
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
 
    return res.status(403).json({
      success: false,
      status: 403,
      message: "Token not found!",
    });
  }

  const token = authHeader.split(" ")[1]; // Remove 'Bearer ' part


jwt.verify(token, PVT_KEY, (err, decoded) => {
  console.log("Decoded token:", decoded);
  if (err)
    return res.status(403).json({ success: false, message: 'Unauthorized access' });

  if (decoded.userType === 1 || decoded.userType === 2) {
    req.user = decoded;
    req.user._id = decoded._id; // ✅ Add this line to ensure req.user._id exists
    return next();
  }

  return res.status(403).json({ success: false, message: 'You are not allowed' });
});
}
