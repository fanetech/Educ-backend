const mongoose = require("mongoose");
const directorySchema = mongoose.Schema(
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
      required: true,
    },
    categorie: {
      type: String,
      default: "none",
    },
    size: {
      type: Number,
    },
    directoryId: {
      type: [String],
    },
    files: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          description: {
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
          path: {
            type: String,
            required: true,
          },
        },
      ],
    },
    depth: {
      type: Number,
      default: 0,
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

directorySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

directorySchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

directorySchema.pre("findById", function () {
  this.where({ isDeleted: false });
});
directorySchema.pre("findByIdAndUpdate", function () {
  this.where({ isDeleted: false });
});
directorySchema.pre("findByIdAndRemove", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("directory", directorySchema);
