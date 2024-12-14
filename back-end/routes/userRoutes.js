const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const pendingTripsController = require('../controllers/pendingTripsController')

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

router.route('/')
    .get(pendingTripsController.getPendingTrips)
    .post(pendingTripsController.addPendingTrip);

router.route('/:tripId')
    .delete(pendingTripsController.removePendingTrip);

module.exports = router