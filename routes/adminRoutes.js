const express = require('express');
const router = express.Router();

const UserController = require('../server/User/UserController');  // ✅ Add this line
const FeedbackController = require('../server/Feedback/FeedbackController');
const CustomerController = require('../server/Customer/CustomerController');
const AnalyticsController = require('../server/Analytics/AnalyticsController');
const verifyToken = require("../config/middleware");

// Feedback routes (admin-specific)
router.post("/addFeedback", verifyToken, FeedbackController.addFeedback);
router.post("/changePassword", verifyToken, UserController.changePassword);  // ✅ added verifyToken for security

router.post("/allFeedback", verifyToken, FeedbackController.allFeedback);
router.post("/changeStatusFeedback", verifyToken, FeedbackController.changeStatusFeedback);
router.get("/admin/getSingleFeedback/:id", verifyToken, FeedbackController.getSingleFeedback);
router.get("/export-feedback-pdf/:userId", verifyToken, FeedbackController.exportUserSpecificFeedbackPDF);

// Customer routes (admin-side management)
router.post('/allcustomer', verifyToken, CustomerController.allcustomer);
router.post("/admin/getSinglecustomer", verifyToken, CustomerController.getSinglecustomer);

router.post('/feedback/update', verifyToken, CustomerController.update);
router.post('/feedback/changeStatus', verifyToken, CustomerController.changeStatus);

// Analytics
router.post("/feedback/stats", verifyToken, AnalyticsController.getFeedbackStats);

module.exports = router;
