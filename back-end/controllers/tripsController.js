const Trip = require('../models/Trip');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

// @desc Get all trips
// @route GET /trips
// @access Public
const getAllTrips = asyncHandler(async (req, res) => {
    const trips = await Trip.find().lean();
    if (!trips?.length) {
        return res.status(400).json({ message: 'No trips found' });
    }
    res.json(trips);
});

// @desc Create new trip
// @route POST /trips
// @access Private
const createNewTrip = [
    upload.single('image'),
    asyncHandler(async (req, res) => {
        const { destination, origin, startDate, endDate, price } = req.body;
        const image = req.file ? req.file.filename : null;

        // Calculate duration in days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        // Confirm required data
        if (!destination || !origin || !startDate || !endDate || !price) {
            return res.status(400).json({ message: 'All fields except image are required' });
        }

        const tripObject = {
            destination,
            origin,
            startDate,
            endDate,
            price: Number(price),
            duration,
            image,
            userId: req.user._id // Assuming you have user authentication middleware
        };

        // Create and store new trip
        const trip = await Trip.create(tripObject);
        if (trip) {
            res.status(201).json({ 
                message: `New trip to ${destination} created`,
                imageUrl: image ? `/uploads/${image}` : null
            });
        } else {
            res.status(400).json({ message: 'Invalid trip data received' });
        }
    }),
];

// @desc Update a trip
// @route PATCH /trips
// @access Private
const updateTrip = [
    upload.single('image'),
    asyncHandler(async (req, res) => {
        const { id, destination, origin, startDate, endDate, price } = req.body;
        const image = req.file ? req.file.filename : null;

        // Confirm data
        if (!id || !destination || !origin || !startDate || !endDate || !price) {
            return res.status(400).json({ message: 'All fields except image are required' });
        }

        // Find trip
        const trip = await Trip.findById(id).exec();
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Calculate new duration
        const start = new Date(startDate);
        const end = new Date(endDate);
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        // Update fields
        trip.destination = destination;
        trip.origin = origin;
        trip.startDate = startDate;
        trip.endDate = endDate;
        trip.price = Number(price);
        trip.duration = duration;
        if (image) {
            // Delete old image if exists
            if (trip.image) {
                const oldImagePath = path.join(__dirname, '..', 'uploads', trip.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            trip.image = image;
        }

        const updatedTrip = await trip.save();
        res.json({ 
            message: `Trip to ${updatedTrip.destination} updated`,
            imageUrl: updatedTrip.image ? `/uploads/${updatedTrip.image}` : null
        });
    }),
];

// @desc Delete a trip
// @route DELETE /trips
// @access Private
const deleteTrip = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Trip ID Required' });
    }

    const trip = await Trip.findById(id).exec();
    if (!trip) {
        return res.status(400).json({ message: 'Trip not found' });
    }

    // Delete image file if exists
    if (trip.image) {
        const imagePath = path.join(__dirname, '..', 'uploads', trip.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    await trip.deleteOne();
    res.json({ message: `Trip to ${trip.destination} deleted` });
});

// @desc Get trip image
// @route GET /trips/:id/image
// @access Public
const getTripImage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const trip = await Trip.findById(id);
    if (!trip || !trip.image) {
        return res.status(404).json({ message: 'Trip image not found' });
    }

    const imagePath = path.join(__dirname, '..', 'uploads', trip.image);
    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ message: 'Trip image not found' });
    }

    res.sendFile(imagePath);
});

module.exports = {
    getAllTrips,
    createNewTrip,
    updateTrip,
    deleteTrip,
    getTripImage
};