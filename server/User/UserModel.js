const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: Number, default: 0 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // userType: 1 = Admin, 2 = Client (Customer)
  userType: { type: Number, enum: [1, 2], default: 2 },

  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('userModel', userSchema);
