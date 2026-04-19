// ============================================================
//  src/controllers/farmerController.js
// ============================================================
const Farmer = require('../models/Farmer')

// req.user.googleId = MongoDB _id (set by authMiddleware)

exports.getProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.googleId })
    if (!farmer) return res.status(404).json({ success: false, message: 'Profile nahi mila' })
    res.json({ success: true, data: farmer })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.upsertProfile = async (req, res) => {
  try {
    const { name, email, phone, location, farm, language } = req.body
    const farmer = await Farmer.findOneAndUpdate(
      { userId: req.user.googleId },
      {
        $set: {
          userId: req.user.googleId,
          name:   name || req.user.name,
          email:  email || req.user.email,
          phone, location, farm, language,
          lastLogin: new Date(),
        }
      },
      { upsert: true, new: true, runValidators: true }
    )
    res.json({ success: true, data: farmer, message: 'Profile save ho gaya ✅' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

exports.updateLocation = async (req, res) => {
  try {
    const { state, district, city, pincode, lat, lng } = req.body
    const farmer = await Farmer.findOneAndUpdate(
      { userId: req.user.googleId },
      { $set: { location: { state, district, city, pincode, lat, lng } } },
      { new: true }
    )
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer nahi mila' })
    res.json({ success: true, data: farmer.location, message: 'Location update ho gaya ✅' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

exports.updateFarm = async (req, res) => {
  try {
    const { areaAcres, soilType, waterSource, currentCrops } = req.body
    const farmer = await Farmer.findOneAndUpdate(
      { userId: req.user.googleId },
      { $set: { farm: { areaAcres, soilType, waterSource, currentCrops } } },
      { new: true }
    )
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer nahi mila' })
    res.json({ success: true, data: farmer.farm, message: 'Farm details save ho gayi ✅' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

exports.saveAdvisory = async (req, res) => {
  try {
    const { location, season, soilType, waterSource, recommendedCrops, mandiPrice, weatherData } = req.body
    const farmer = await Farmer.findOneAndUpdate(
      { userId: req.user.googleId },
      {
        $push: {
          advisoryHistory: {
            $each:     [{ location, season, soilType, waterSource, recommendedCrops, mandiPrice, weatherData }],
            $position: 0,
            $slice:    20,
          }
        }
      },
      { upsert: true, new: true }
    )
    res.json({ success: true, message: 'Advisory save ho gaya ✅' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

exports.getAdvisoryHistory = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.googleId })
      .select('advisoryHistory name location')
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer nahi mila' })
    res.json({ success: true, data: farmer.advisoryHistory })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    await Farmer.findOneAndDelete({ userId: req.user.googleId })
    res.json({ success: true, message: 'Account delete ho gaya' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
