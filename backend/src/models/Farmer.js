const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
  state:    { type: String, required: true },
  district: { type: String, required: true },
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
}, { _id: true })

const FarmerSchema = new mongoose.Schema({
  googleId:        { type: String, unique: true, sparse: true },
  name:            { type: String, required: true },
  email:           { type: String, required: true, unique: true, lowercase: true },
  avatar:          { type: String },
  phone:           { type: String },
  location:        { type: LocationSchema },
  farm:            { type: FarmSchema },
  advisoryHistory: { type: [AdvisorySchema], default: [] },
  language:        { type: String, enum: ['hi','en'], default: 'hi' },
  notifications:   { type: Boolean, default: true },
  isActive:        { type: Boolean, default: true },
  lastLogin:       { type: Date },
}, { timestamps: true })

FarmerSchema.index({ 'location.state': 1, 'location.district': 1 })
FarmerSchema.index({ email: 1 })
FarmerSchema.index({ googleId: 1 })

module.exports = mongoose.model('Farmer', FarmerSchema)