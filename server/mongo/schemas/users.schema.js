module.exports = { users: function users(Schema) {
	return new Schema({
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
    password: { type: String },
    loginAttempts: { type: Number, default: 0 },
    imageUrl: { type: String },
    role: { type: String, required: true },
    status: { type: String, default: 'pending' }, // active, pending, blocked
    origin: { type: String, default: 'form' }
	}, { timestamps	: { updatedAt: 'updated_at', createdAt: 'created_at' } });
}};