const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			minLength: 3,
			maxLength: 55,
			unique: true,
			trim: true,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		schoolId: {
			type: [String],
		},
		number: {
			type: String,
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
		adress: {
			type: String,
		},
		password:{
			type:String,
			required: true,
			max: 1024,
			minlength: 8,
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
  
  //play function if login for decode password
  userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		
		if (auth) {
		return user;
	  }
	  throw Error("incorrect password");
	}
	throw Error("incorrect email");
  };

module.exports = mongoose.model('user', userSchema);
