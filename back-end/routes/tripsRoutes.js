const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/tripsController');
const verifyJWT = require('../middleware/verifyJWT'); // Assuming you have this middleware

// Public routes
router.get('/', tripsController.getAllTrips);
router.get('/:id/image', tripsController.getTripImage);

// Protected routes
router.use(verifyJWT); // Apply authentication middleware to routes below
router.post('/', tripsController.createNewTrip);
router.patch('/', tripsController.updateTrip);
router.delete('/', tripsController.deleteTrip);

module.exports = router;