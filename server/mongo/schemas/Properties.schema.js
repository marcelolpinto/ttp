const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = { Properties: mongoose.model('properties',
	new Schema({
    realtorId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: String,
    placeId: String, // google place id
    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    bedrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    price: { type: Number, required: true },
    isRented: { type: Boolean, default: false }
    
	}, {
    timestamps	: { updatedAt: 'updated_at', createdAt: 'created_at' }
  })
)};