// ============================================================
//  src/models/User.js
// ============================================================
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String },           // null for Google users
  googleId:     { type: String },           // null for email users
  avatar:       { type: String },
  provider:     { type: String, enum: ['email', 'google'], default: 'email' },
  createdAt:    { type: Date, default: Date.now },
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema);