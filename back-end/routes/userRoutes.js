const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const pendingTripsController = require('../controllers/pendingTripsController')
const auth = require('../middleware/verifyJWT')

// Existing user routes
router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

// Pending Trips routes
router.route('/pending-trips')
    .get(auth, pendingTripsController.getPendingTrips)
    .post(auth, pendingTripsController.addPendingTrip);

router.route('/pending-trips/:tripId')
    .delete(auth, pendingTripsController.removePendingTrip)

module.exports = router