// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const UserController = require('../server/User/UserController');
const CustomerController = require('../server/Customer/CustomerController');
const FeedbackController = require('../server/Feedback/FeedbackController');
const verifyToken = require("../config/middleware");

// Auth
router.post('/register', CustomerController.register);
router.post('/login', UserController.login);

// User-side Feedback
router.post('/addFeedback', verifyToken, FeedbackController.addFeedback);

// User can export their own report
router.get("/export-feedback-pdf/:userId", verifyToken, FeedbackController.exportUserSpecificFeedbackPDF);

module.exports = router;
