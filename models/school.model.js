const mongoose = require("mongoose");
const { isEmail } = require("validator");
const schoolSchema = mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
      trim: true,
    },
    founderId: {
      type: String,
      required: true,
    },
    schoolEmail: {
      type: String,
      validate: [isEmail],
    },
    slogan: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    schoolYears: {
      type: [
        {
          starYear: Date,
          endYear: Date,
          division: String,
          periods: {
            type: [
              {
                starDate: Date,
                endDate: Date,
                status: Boolean,
              },
            ],
          },
          deadlines: {
            type: [
              {
                starDate: Date,
                endDate: Date,
                price: Number,
              },
            ],
          },
        },
      ],
    },
    actors: {
      type: [
        {
          role: String,
          actif: Boolean,
          userId: String,
        },
      ],
    },
    subscribes: {
      type: [
        {
          regisDate: Date,
          subDate: Date,
          testDate: Date,
          status: Boolean,
          sms: Number,
          whatsapp: Number,
          mail: Number,
          library: Number,
        },
      ],
    },
    class: {
      type: [String],
    },
    settings: {
      payment: {
        type: [
          {
            class: String,
            feilds: {
              type: [
                {
                  name: String,
                  price: String,
                },
              ],
            },
          },
        ],
      },
    },
    library: {
      name: {
        type: String,
      },
      size: {
        type: Number,
        default: 0,
      },
      documentId: {
        type: [String],
      },
    },
  },
  {
    timestamps: true,
  }
);

schoolSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

schoolSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

schoolSchema.pre("findById", function () {
  this.where({ isDeleted: false });
});
schoolSchema.pre("findByIdAndUpdate", function () {
  this.where({ isDeleted: false });
});
schoolSchema.pre("findByIdAndRemove", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("school", schoolSchema);
