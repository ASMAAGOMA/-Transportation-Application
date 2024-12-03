const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    origin: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    duration: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });

  const Trip = mongoose.model('Trip', tripSchema);