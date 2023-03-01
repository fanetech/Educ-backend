const { default: mongoose } = require("mongoose");
const classroomModel = require("../../models/classroum.model");
const schoolModel = require("../../models/school.model");
const classroumService = require("./classroum.service");
const { globalSatuts } = require("../../utils/utils.errors");
const { isEmpty } = require("../../utils/utils.tools");
const connectDB = require("../../config/db");

module.exports.create = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

  const { name, price, schoolId, schoolYearsId } = req.body;
  let deadlines = req?.body?.deadlines;
  if (!name || !price || !schoolId ) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }

  let schoolYear, school;

  try {
    school = await schoolModel.findById(schoolId); //TODO create service to school
    schoolYear = school.schoolYears.find((d) => d._id.equals(schoolYearsId));
  } catch (err) {
    return res.status(400).json({ msg: "error", err: "school no found" });
  }

  if (!schoolYear)
    return res.status(400).json({ msg: "error", err: "dynamicId no found" });

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async (session) => {
      const schoolDeadlines = schoolYear.deadlines;
      if (isEmpty(deadlines)) {
        if (isEmpty(schoolDeadlines)) {
          return res
            .status(400)
            .json({ msg: "error", err: "deadlines no found in school year" });
        } else {
          let d = [];
          for (const sd of schoolDeadlines) {
            const deadlinesObject = {
              starDate: sd?.starDate,
              endDate: sd?.endDate,
              price: (sd?.price / 100) * price,
            };
            d.push(deadlinesObject);
          }
          deadlines = d;
        }
      }
      const newClassroum = await classroomModel.create(
        
          {
            name,
            totalPrice: price,
            schoolId,
            deadlines,
          },        
      );
      if (isEmpty(newClassroum))
        return res.status(500).json({ msg: "error", err: "Internal error" });
      schoolYear.classroomIds.push(newClassroum._id);
      await school.save({ session });
      const classroum = await newClassroum.save({ session });

      await session.commitTransaction();

      if (classroum) {
        return res.status(200).json({ msg: "success", classroum });
      } else {
        return res.status(500).json({ msg: "error", err: "Internal error" });
      }
    });
    session.endSession();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "error", err });
  }
};

module.exports.getAll = async (req, res) => {
  const data = await classroumService.getAll();
  return await globalSatuts(res, data);
};

module.exports.getOne = async (req, res) => {
  const data = await classroumService.getOne(req.params.id);
  return await globalSatuts(res, data);
};

module.exports.matter = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });
  const { name, coef, teacherId, horaire } = req.body;
  if (!name || !coef || !teacherId || !horaire) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  const data = { name, coef, teacherId, horaire };
  const response = await classroumService.matter(req.params.id, data);
  return await globalSatuts(res, response);
};

module.exports.pupil = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });
  const {
    lastname,
    firstname,
    pay,
    complement,
    role,
    birthday,
    oldSchool,
    birthCountry,
  } = req.body;
  if (!lastname || !firstname || !birthday || !birthCountry) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  const data = {
    lastname,
    firstname,
    pay,
    complement,
    role,
    birthday,
    oldSchool,
    birthCountry,
    createdAt: new Date(),
  };
  const response = await classroumService.pupil(req.params.id, data);
  return await globalSatuts(res, response);
};

module.exports.note = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

  const { matter, value, matterId, pupilId, periodId } = req.body;
  const id = req.params.id;
  if (!value || !matterId || !id || !pupilId || !periodId) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  const data = await classroumService.note(id, pupilId, periodId, {
    value,
    matterId
  });
  return await globalSatuts(res, data);
};
