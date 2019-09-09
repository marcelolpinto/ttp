const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = { Users: mongoose.model('users',
	new Schema({
		name: { type: String },
		email: { type: String, required: true, unique: true },
    password: { type: String },
    loginAttempts: { type: Number, default: 0 },
    imageUrl: { type: String },
    role: { type: String, required: true },
    status: { type: String, default: 'pending' }, // active, pending, blocked, invited
    origin: { type: String, default: 'form' }
  }, {
    timestamps	: { updatedAt: 'updated_at', createdAt: 'created_at' }
  })
)};