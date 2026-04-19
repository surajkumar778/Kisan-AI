const express = require('express')
const router  = express.Router()
const {
  getProfile,
  upsertProfile,
  updateLocation,
  updateFarm,
  saveAdvisory,
  getAdvisoryHistory,
  deleteAccount,
} = require('../controllers/farmerController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get   ('/profile',  getProfile)
router.post  ('/profile',  upsertProfile)
router.put   ('/location', updateLocation)
router.put   ('/farm',     updateFarm)
router.post  ('/advisory', saveAdvisory)
router.get   ('/advisory', getAdvisoryHistory)
router.delete('/account',  deleteAccount)

module.exports = router