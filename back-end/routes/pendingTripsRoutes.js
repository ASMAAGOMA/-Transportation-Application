const express = require('express');
const router = express.Router();
const pendingTripsController = require('../controllers/pendingTripsController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(pendingTripsController.getPendingTrips)
    .post(pendingTripsController.addPendingTrip);

router.route('/:tripId')
    .delete(pendingTripsController.removePendingTrip);

module.exports = router;