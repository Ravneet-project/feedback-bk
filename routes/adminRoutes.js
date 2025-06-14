// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const FeedbackController = require('../server/Feedback/FeedbackController');
const CustomerController = require('../server/Customer/CustomerController');
const AnalyticsController = require('../server/Analytics/AnalyticsController');
const verifyToken = require("../config/middleware");

// Feedback routes (admin-specific)
router.post("/addFeedback", verifyToken, FeedbackController.addFeedback);
router.post("/allFeedback", verifyToken, FeedbackController.allFeedback);
router.post("/changeStatusFeedback", verifyToken, FeedbackController.changeStatusFeedback);
router.get("/getSingleFeedback/:id", verifyToken, FeedbackController.getSingleFeedback);
router.get("/export-feedback-pdf/:userId", verifyToken, FeedbackController.exportUserSpecificFeedbackPDF);

// Customer routes (admin-side management)
router.post('/allcustomer', verifyToken, CustomerController.allcustomer);
router.post('/getSinglecustomer', verifyToken, CustomerController.getSinglecustomer);
router.post('/feedback/update', verifyToken, CustomerController.update);
router.post('/feedback/changeStatus', verifyToken, CustomerController.changeStatus);

// Analytics
router.post("/feedback/stats", verifyToken, AnalyticsController.getFeedbackStats);

module.exports = router;
