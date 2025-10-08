// routes/userRoutes.js
const express = require("express");
const router = express.Router();

// Controllers
const UserController = require("../server/User/UserController");
const CustomerController = require("../server/Customer/CustomerController");
const FeedbackController = require("../server/Feedback/FeedbackController");

// Middleware
const verifyToken = require("../config/middleware");

// ====================== AUTH ROUTES ======================

// Register a new customer
router.post("/register", CustomerController.register);

// Login user
router.post("/login", UserController.login);

router.post("/changePassword", verifyToken, UserController.changePassword);

// ====================== USER FEEDBACK ROUTES ======================

// Add feedback (only for logged-in users)
router.post("/addFeedback", verifyToken, FeedbackController.addFeedback);
 

// Export logged-in user's feedback report as PDF
router.get(
  "/export-feedback-pdf/:userId",
  verifyToken,
  FeedbackController.exportUserSpecificFeedbackPDF
);

module.exports = router;
