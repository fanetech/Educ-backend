const mongoose = require("mongoose");
const fileSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    creatorId: {
      type: String,
    },
    path: {
      type: String,
    },
    categorie: {
      type: String,
      default: "none",
    },
    size: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

fileSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

fileSchema.pre("findById", function () {
  this.where({ isDeleted: false });
});
fileSchema.pre("findByIdAndUpdate", function () {
  this.where({ isDeleted: false });
});
fileSchema.pre("findByIdAndRemove", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("file", fileSchema);
