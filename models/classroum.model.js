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
    teachers: {
      type: [
        {
          teacherId: String,
          isPrincipal: {
            type: Boolean,
            default: false
          }

        }
      ],
    },
    totalPupil: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    deadlines: {
      type: [
        {
          periodId: String,
          price: Number,
        },
      ],
    },
    fileId: {
      type: [String],
    },
    absences: {
      type: [
        {
          date: {
            type: Date,
            default: new Date()
          },
          timeNumber: Number,
          periodId: String,
          pupils: {
            type: [
              {
                pupilId: String,
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
          notesByPeriod: {
            type: [
              {
                periodId: String,
                notes: {
                  type: [
                    {
                      value: Number,
                      matterId: {
                        type: String,
                      }
                    },
                  ],
                },
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