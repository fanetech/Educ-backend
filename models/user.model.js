const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
	{
		userName: {
			type: String,
			minLength: 3,
			maxLength: 55,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		school:[
			{
				userId: String,
				role: String,
				status:{
					type: String,
					default: true
				}
			}
		],
		number: {
			type: String,
			trim: true,
			unique:true
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
		adress: {
			type: String,
		},
		password:{
			type:String,
			required: true,
			max: 1024,
			minlength: 8
		}
	},
	{
		timestamps: true,
	},
);

//play function before save user and crypt password
userSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(this.password, salt);
	next();
  });

module.exports = mongoose.model('user', userSchema);
