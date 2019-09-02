module.exports = { users: function users(Schema) {
	return new Schema({
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    max_calories: { type: Number, default: 2000 }
	}, { timestamps	: { updatedAt: 'updated_at', createdAt: 'created_at' } });
}};