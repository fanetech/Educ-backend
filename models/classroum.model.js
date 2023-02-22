const mongoose = require("mongoose");
const { PUPIL_ROLE, BOOL } = require("../services/constant");
const classroomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    schoolId: {
      type: String,
      required: true,
    },
    principalId: {
      type: String,
    },
    total: {
      type: Number,
    },
    totalPrice: {
      type: Number,
      required: true,
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
    fileId: {
      type: [String],
    },
    absence: {
      type: [
        {
          date: Date,
          time: Number,
          detail: {
            type: [
              {
                pupilId: Number,
                reason: String,
                justify: {
                  type: Boolean,
                  default: false,
                },
              },
            ],
          },
        },
      ],
    },
    matters: {
      type: [
        {
          name: String,
          coef: Number,
          teacherId: String,
          horaire: Number,
        },
      ],
      required: true,
    },
    pupils: {
      type: [
        {
          lastname: String,
          firstname: String,
          birthCountry: String,
          oldSchool: String,
          createdAt: Date,
          birthday: Date,
          pay: Number,
          sanction: Number,
          average: Number,
          rank: Number,
          complement: {
            type: Boolean,
            default: false,
            enum: {
              values: BOOL,
              message: "{VALUE} Non supporter",
            },
          },
          role: {
            type: String,
            default: "none",
            enum: {
              values: PUPIL_ROLE,
              message: "{VALUE} Non supporter",
            },
          },
          notes: {
            type: [
              {
                periodId: String,
                values: {
                  type: [
                    {
                      matter: String,
                      value: Number,
                      matterId: String,
                    }
                  ]
                }
              },
            ],
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

classroomSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

classroomSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

classroomSchema.pre("findById", function () {
  this.where({ isDeleted: false });
});
classroomSchema.pre("findByIdAndUpdate", function () {
  this.where({ isDeleted: false });
});
classroomSchema.pre("findByIdAndRemove", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("classroom", classroomSchema);
