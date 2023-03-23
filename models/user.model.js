const mongoose = require('mongoose');
const { isEmail } = require('validator');
const { BOOL } = require('../services/constant');
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
    schools: [
      {
        schoolId: String,
        role: String,
        status: {
          type: String,
          default: true,
          enum: {
            values: BOOL,
            message: "{VALUE} Non supporter",
          },
        },
      },
    ],
    number: {
      type: String,
      trim: true,
      unique: true,
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
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('user', userSchema);
