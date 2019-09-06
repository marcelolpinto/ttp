module.exports = { properties: function properties(Schema) {
	return new Schema({
    realtorId: { type: Schema.Types.ObjectId, ref: 'users' },
    name: { type: String, required: true },
    address: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    bedrooms: Number,
    area: Number,
    price: Number,
    isRented: { type: Boolean, default: false }
    
	}, { timestamps	: { updatedAt: 'updated_at', createdAt: 'created_at' } });
}};