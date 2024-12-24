const mongoose = require("mongoose");
const User = require("./User");

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId,ref :User, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['success', 'error', 'info'], default: 'info' },
    status: { type: String, default: 'unread' }, 
    createdAt: { type: Date, default: Date.now },
  });
  module.exports= mongoose.model("Notification", notificationSchema);