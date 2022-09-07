const mongoose = require('mongoose');
const { isEmail } = require('validator');
const userSchema = mongoose.Schema(
	{
		userName: {
			type: String,
			trim: true,
		},
		firstName: {
			type: String,
			require: true,
			trim: true,
		},
		lastName: {
			type: String,
			require: true,
			trim: true,
		},
		schoolId: {
			type: [String],
		},
		number: {
			type: Number,
			trim: true,
		},
		email: {
			type: String,
			validate: [isEmail],
			lowercase: true,
			trim: true,
			unique: true,
		},
		role: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);
module.exports = mongoose.model('user', userSchema);
