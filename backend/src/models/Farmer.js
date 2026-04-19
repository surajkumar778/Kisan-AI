// ============================================================
//  src/models/Farmer.js
// ============================================================
const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
  state:    { type: String },
  district: { type: String },
  city:     { type: String },
  pincode:  { type: String },
  lat:      { type: Number },
  lng:      { type: Number },
}, { _id: false })

const FarmSchema = new mongoose.Schema({
  areaAcres:    { type: Number },
  soilType:     { type: String, enum: ['alluvial','black','red','laterite','sandy','loamy','clayey','other'] },
  waterSource:  { type: String, enum: ['rain','canal','borewell','river','tank','other'] },
  currentCrops: [{ type: String }],
}, { _id: false })

const AdvisorySchema = new mongoose.Schema({
  date:             { type: Date, default: Date.now },
  location:         { type: String },
  season:           { type: String },
  soilType:         { type: String },
  waterSource:      { type: String },
  recommendedCrops: [{ type: String }],
  mandiPrice:       { type: mongoose.Schema.Types.Mixed },
  weatherData:      { type: mongoose.Schema.Types.Mixed },
})

const FarmerSchema = new mongoose.Schema({
  userId:          { type: String, required: true, unique: true }, // MongoDB _id from User
  name:            { type: String },
  email:           { type: String, lowercase: true },
  phone:           { type: String },
  location:        { type: LocationSchema },
  farm:            { type: FarmSchema },
  advisoryHistory: { type: [AdvisorySchema], default: [] },
  language:        { type: String, enum: ['hi','en'], default: 'hi' },
  lastLogin:       { type: Date },
}, { timestamps: true })

FarmerSchema.index({ userId: 1 })
FarmerSchema.index({ 'location.state': 1, 'location.district': 1 })

module.exports = mongoose.model('Farmer', FarmerSchema)
