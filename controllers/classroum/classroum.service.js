const classroomModel = require("../../models/classroum.model");
const { isEmpty } = require("../../utils/utils.tools");
const schoolModel = require("../../models/school.model");

module.exports.getAll = async () => {
  const classroums = await classroomModel.find().sort({ createdAt: -1 });
  if (classroums) return { send: { msg: "success", classroums }, status: 200 };
  else return { send: { msg: "error", err: "Internal error" }, status: 500 };
};

// TODO
module.exports.getOne = async (id) => {
  try {
    const classroum = await classroomModel
      .findById(id)
      // .populate("pupils.notes.values.matterId", [
      //   "name",
      //   "coef",
      // ]);
    if (classroum) return { send: { msg: "success", classroum }, status: 200 };
    else {
      return { send: { msg: "error", err: "Internal error" }, status: 404 };
    }
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: err }, status: 500 };
  }
};

module.exports.note = async (id, pupilId, periodId, data) => {
  try {
    const classroum = await classroomModel.findById(id);
    if (!classroum)
      return { send: { msg: "error", err: "class no found" }, status: 404 };
    const pupil = classroum.pupils.find((p) => p._id.equals(pupilId));
    if (!pupil)
      return { send: { msg: "error", err: "pupil no found" }, status: 404 };

    const note = pupil.notes.find((p) => p.periodId === periodId);
    if (!note)
      return { send: { msg: "error", err: "period no found" }, status: 404 };
    const value = note.values.find((p) => p.matterId === data.matterId);
    if (value)
      return { send: { msg: "error", err: "matter existe" }, status: 404 };
    note.values.push(data);
    const c = await classroum.save();
    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", classroum: c }, status: 200 };
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

module.exports.matter = async (id, data) => {
  try {
    const classroum = await (await this.getOne(id)).send.classroum;
    if (classroum.status === "error")
      return { send: { msg: "error", err: "class no found" }, status: 404 };
    classroum.matters.push(data);
    const c = await classroum.save();
    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", classroum: c }, status: 200 };
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

module.exports.pupil = async (id, data) => {
  try {
    const classroum = await (await this.getOne(id)).send.classroum;
    if (classroum.status === "error")
      return { send: { msg: "error", err: "class no found" }, status: 404 };

    const matters = classroum?.matters;
    if (isEmpty(matters))
      return { send: { msg: "error", err: "Matter is null" }, status: 404 };

    const school = await schoolModel.findById(classroum.schoolId);
    const currentSchoolYear = getCurrentObject(school.schoolYears);
    const periods = currentSchoolYear.periods;
    if (isEmpty(periods))
      return { send: { msg: "error", err: "Period is null" }, status: 404 };
    let notesPeriod = [];
    for (const p of periods) {
      const periodObject = {
        periodId: p._id,
        values: pupilMatter,
      };
      notesPeriod.push(periodObject);
    }
    
    const pupil = classroum.pupils;
    const p = data?.pay ?? classroum.totalPrice;
    const d = {
      ...data,
      pay: p,
      notes: notesPeriod,
    };
    pupil.push(d);
    const c = await classroum.save();
    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", classroum: c }, status: 200 };
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

const getCurrentObject = (array) => {
  if (isEmpty(array))
    return { send: { msg: "error", err: "schoolYear is null" }, status: 404 };
  return array[array.length - 1];
};

module.exports.update = async (id, data) => {
  try {
    const classroom = await (await this.getOne(id)).send.classroum;
    if (classroom.status === "error")
    return { send: { msg: "error", err: "class no found" }, status: 404 };

    if(data?.name)
      classroom.name = data.name
    if(data?.principalId)
      classroom.principalId = data.principalId

      const c = await classroom.save();
      if (!c)
        return { send: { msg: "error", err: "Internal error" }, status: 500 };
      return { send: { msg: "success", classroom: c }, status: 200 };
    
  } catch (error) {
    console.log(error);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
}
