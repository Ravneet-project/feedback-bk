const mongoose = require("mongoose");

// const feedbackSchema = mongoose.Schema({
// user: {type: mongoose.Schema.Types.ObjectId,ref: 'userModel', required: true},// ✅ Ensure required
//   category: { type: String, required: true },
//   priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
//   message: { type: String, required: true },
//   status: { type: String, enum: ['open', 'pending', 'closed', 'resolved'], default: 'pending' },
// response: { type: String }, // Admin reply
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("feedbackModel", feedbackSchema);

const feedbackSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'userModel', required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'pending', 'closed', 'resolved'], default: 'pending' },
  reply: { type: String }, // ✅ changed from "response" to "reply"
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("feedbackModel", feedbackSchema);