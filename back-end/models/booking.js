const mongoose = require("mongoose");
const Trip = require("./Trip");

const BookingSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: Trip },
    tickets: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    destination: { type: String, required: true },
});

module.exports = mongoose.model("Booking", BookingSchema);
                                                                                            