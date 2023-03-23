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
  if (!name || !price || !schoolId) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  const data = await classroumService.create(req.body);
  return await globalSatuts(res, data);
  
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

module.exports.absence = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

  const { timeNumber, periodId, pupils } = req.body;
  if (!timeNumber || !periodId || isEmpty(pupils)) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  const response = await classroumService.absence(req.params.id, req.body);
  return await globalSatuts(res, response);
}

module.exports.addAbsence = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

  const { absenceId, pupils } = req.body;
  if (!absenceId || !pupils) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }

  const response = await classroumService.addAbsence(req.params.id, req.body);
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
    schoolYearId
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
    schoolYearId
  };
  const response = await classroumService.pupil(req.params.id, data);
  return await globalSatuts(res, response);
};

module.exports.note = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

  const { value, matterId, pupilId, noteByPeriodId } = req.body;
  const id = req.params.id;
  if (!value || !id || !pupilId || !noteByPeriodId || !matterId) {
    return res.status(400).json({ msg: "error", err: "data no complete" });
  }
  const data = await classroumService.note(id, pupilId, noteByPeriodId, {
    value,
    matterId
  });
  return await globalSatuts(res, data);
};


module.exports.update = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

  const data = await classroumService.update(req.params.id, req.body)
  return await globalSatuts(res, data);
}

module.exports.updatePupil = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

  const data = await classroumService.updatePupil(req.params.id, req.body)
  return await globalSatuts(res, data);
}

module.exports.updateAbsence = async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ msg: "error", err: "No data" });

  const data = await classroumService.updateAbsence(req.params.id, req.body)
  return await globalSatuts(res, data);
}
