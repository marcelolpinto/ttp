module.exports = { meals: function meals(Schema) {
	return new Schema({
		user_id: { type: Schema.Types.ObjectId, ref: 'users' },
		name: { type: String, required: true },
		date: { type: Date, required: true },
		calories: { type: Number, required: true },
	}, { timestamps	: { updatedAt: 'updated_at', createdAt: 'created_at' } });
}};