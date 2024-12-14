const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const pendingTripsController = require('../controllers/pendingTripsController')

// User routes
router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

// Pending trips routes
router.route('/pending-trips')
    .get(pendingTripsController.getPendingTrips)
    .post(pendingTripsController.addPendingTrip);

router.route('/pending-trips/:tripId')
    .delete(pendingTripsController.removePendingTrip);

module.exports = router