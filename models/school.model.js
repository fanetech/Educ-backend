const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { BOOL, DIVISION, ACTORS_ROLE } = require("../services/constant");
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
      enum: {
        values: BOOL,
        message: "{VALUE} Non supporter. try this ('true', 'false')",
      },
    },
    schoolYears: {
      type: [
        {
          fullYear: String,
          starYear: Date,
          endYear: Date,
          nDivision: Number,
          division: {
            type: String,
            default: "other",
            enum: {
              values: DIVISION,
              message:"{VALUE} Non supporter. try this ('trimester', 'semester', 'others')",
            },
          },
          periods: {
            type: [
              {
                fullPeriod: String,
                name: String,
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
          classroomIds: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "classroom" }],
          },
        },
      ],
    },
    actors: {
      type: [
        {
          role: {
            type: String,
            enum: {
              values: ACTORS_ROLE,
              message: "{VALUE} Non supporter",
            },
          },
          actif: Boolean,
          userId: { type: String, ref: "user" },
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
        type: String,
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
