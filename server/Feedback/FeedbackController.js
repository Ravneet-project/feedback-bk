const feedbackModel = require('./FeedbackModel');
const mongoose = require("mongoose");
const fs = require("fs");
const nodemailer = require("nodemailer");
const userModel = require("../User/UserModel");
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit')
const path = require('path'); // ✅ THIS IS REQUIRED


// ✅ Add Feedback
const addFeedback = (req, res) => {
  let feedbackObj = new feedbackModel({
    user: req.user._id,
    category: req.body.category,
    priority: req.body.priority,
    message: req.body.message,
    status: req.body.status || 'pending'
  });

  feedbackObj.save()
    .then((feedbackData) => {
      res.json({
        success: true,
        status: 200,
        message: 'Feedback added successfully',
        data: feedbackData,
      });
    })
    .catch((err) => {
      console.log("Error saving feedback:", err);
      res.json({
        success: false,
        status: 500,
        message: 'Internal server error',
        error: err,
      });
    });
};


const allFeedback = async(req, res) => {
let limit=req.body.limit  ||null
let currentPage=req.body.currentPage-1 ||null
delete req.body.limit
delete req.body.currentPage
let total = await feedbackModel.countDocuments().exec()
  feedbackModel.find()
    .populate({ path: 'user', model: 'userModel', select: 'name email' })
    .sort({ createdAt: -1 })
     .limit(limit)
     .skip(currentPage*limit)
    .then((feedbackData) => {
      if (feedbackData.length > 0) {
        res.json({
          success: true,
          status: 200,
          message: 'Feedback loaded successfully',
          total:total,
          data: feedbackData
        });
      } else {
        res.json({
          success: false,
          status: 200,
          message: 'No data found'
        });
      }
    })
    .catch((err) => {
      res.json({
        success: false,
        status: 500,
        message: 'Internal server error',
        error: err
      });
    });
};

const changeStatusFeedback = (req, res) => {
  const { _id, status, reply } = req.body;
  const validStatuses = ['open', 'pending', 'closed', 'resolved'];

  let validation = [];

  if (!_id) validation.push("_id is required");
  if (status && !validStatuses.includes(status)) validation.push("Invalid status value");

  if (validation.length > 0) {
    return res.status(422).json({
      success: false,
      message: validation
    });
  }

  feedbackModel.findById(_id)
    .then((feedbackData) => {
      if (!feedbackData) {
        return res.status(404).json({
          success: false,
          message: "No feedback found!"
        });
      }

      // Update fields if provided
      if (status) feedbackData.status = status;
      if (reply !== undefined) feedbackData.reply = reply;

      return feedbackData.save().then((updatedData) => {
        res.json({
          success: true,
          message: "Feedback updated successfully!",
          data: updatedData
        });
      });
    })
    .catch((err) => {
      console.error("Error in changeStatusFeedback:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    });
};

//get single
const getSingleFeedback = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid feedback ID" });
  }

  try {
    const data = await feedbackModel.findById(id).populate("user", "name email");

    if (!data) {
      return res.status(404).json({ 
        success: false,
         message: "Feedback not found" });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.log("Error in getSingleFeedback:", error);
    res.status(500).json({ success: false, 
      message: "Server error" });
  }
};

const exportUserSpecificFeedbackPDF = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid userId provided",
    });
  }

  try {
    const feedbacks = await feedbackModel
      .find({ user: userId, reply: { $exists: true, $ne: '' } })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (!feedbacks.length) {
      return res.status(404).json({
        success: false,
        message: "No replied feedbacks found for this user",
      });
    }

    const user = feedbacks[0].user;
    const outputDir = path.join(__dirname, '../public/pdfs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fileName = `feedback_${userId}.pdf`;
    const filePath = path.join(outputDir, fileName);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(18).text("User Feedback Report", { align: "center" }).moveDown();

    feedbacks.forEach((fb, index) => {
      doc
        .fontSize(12)
        .text(`Name     : ${fb.user.name}`)
        .text(`Email    : ${fb.user.email}`)
        .text(`Category : ${fb.category}`)
        .text(`Priority : ${fb.priority}`)
        .text(`Status   : ${fb.status}`)
        .text(`Message  : ${fb.message}`)
        .text(`Reply    : ${fb.reply}`)
        .moveDown();

      if (index !== feedbacks.length - 1) doc.addPage();
    });

    doc.end();

    // Wait until the PDF is fully written
    writeStream.on("finish", async () => {
      try {
        const transporter = nodemailer.createTransport({
          
  service: "gmail",
 auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
}

});


        const mailOptions = {
          from: `"Admin" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Your Feedback Report",
          text: `Dear ${user.name},\n\nPlease find attached your feedback report.\n\nRegards,\nAdmin Team`,
          attachments: [
            {
              filename: fileName,
              path: filePath,
            },
          ],
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
          success: true,
          message: `PDF exported and emailed to ${user.email}`,
          url: `${req.protocol}://${req.get("host")}/pdfs/${fileName}`,
        });

      } catch (emailErr) {
        console.error(" Email Error:", emailErr);
        return res.status(500).json({
          success: false,
          message: "PDF created but failed to send email",
          error: emailErr.message,
        });
      }
    });

    writeStream.on("error", (err) => {
      console.error(" File Stream Error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to write PDF",
        error: err.message,
      });
    });

  } catch (err) {
    console.error(" PDF Export Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};


module.exports = {addFeedback,allFeedback,changeStatusFeedback,exportUserSpecificFeedbackPDF,getSingleFeedback};
