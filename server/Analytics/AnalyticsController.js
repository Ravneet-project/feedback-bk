const UserModel = require('../User/UserModel');
const FeedbackModel = require('../Feedback/FeedbackModel');

// GET /api/feedback/stats
const getFeedbackStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalFeedbacks = await FeedbackModel.countDocuments();

    // Priority breakdown
    const highPriority = await FeedbackModel.countDocuments({ priority: "High" });
    const mediumPriority = await FeedbackModel.countDocuments({ priority: "Medium" });
    const lowPriority = await FeedbackModel.countDocuments({ priority: "Low" });

    res.status(200).json({
      totalUsers,
      totalFeedbacks,
      priorities: {
        High: highPriority,
        Medium: mediumPriority,
        Low: lowPriority,
      }
    });
  } catch (error) {
    console.error("Feedback Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { getFeedbackStats };
