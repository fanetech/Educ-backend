const classroomModel = require("../../models/classroum.model");
const { isEmpty } = require("../../utils/utils.tools");
const schoolModel = require("../../models/school.model");
const { PUPIL_ROLE } = require("../../services/constant");

module.exports.getAll = async () => {
  const classroums = await classroomModel.find().sort({ createdAt: -1 });
  if (classroums) return { send: { msg: "success", classroums }, status: 200 };
  else return { send: { msg: "error", err: "Internal error" }, status: 500 };
};

// TODO
module.exports.getOne = async (id) => {
  try {
    const classroom = await classroomModel.findById(id)
    if (classroom) return { send: { msg: "success", classroom }, status: 200 };
    else {
      return { send: { msg: "error", err: "Internal error" }, status: 404 };
    }
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: err }, status: 500 };
  }
};

module.exports.note = async (id, pupilId, noteByPeriodId, data) => {
  try {
    const classroom = await classroomModel.findById(id);
    if (!classroom)
      return { send: { msg: "error", err: "class no found" }, status: 404 };

    const pupil = classroom.pupils.find((p) => p._id.equals(pupilId));
    if (!pupil)
      return { send: { msg: "error", err: "pupil no found" }, status: 404 };

    const noteByPeriod = pupil.notesByPeriod.find((n) => n._id.equals(noteByPeriodId));
    if (!noteByPeriod)
      return { send: { msg: "error", err: "period no found" }, status: 404 };

    if (getObjectValue(data.matterId, noteByPeriod.notes))
      return { send: { msg: "error", err: "matter existe" }, status: 404 };

    noteByPeriod.notes.push(data);

    const c = await classroom.save();
    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };

    return { send: { msg: "success", classroom: c }, status: 200 };

  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

module.exports.matter = async (id, data) => {
  try {
    const classroom = await (await this.getOne(id)).send.classroom;

    if (classroom.status === "error")
      return { send: { msg: "error", err: "class no found" }, status: 404 };

    classroom.matters.push(data);
    const c = await classroom.save();

    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", classroom: c }, status: 200 };

  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

module.exports.pupil = async (id, data) => {
  try {
    const classroom = await (await this.getOne(id)).send.classroom;
    classroom.totalPupil = classroom.totalPupil + 1

    if (classroom.status === "error")
      return { send: { msg: "error", err: "class no found" }, status: 404 };

    const matters = classroom?.matters;
    if (isEmpty(matters))
      return { send: { msg: "error", err: "Matter is null" }, status: 404 };

    if (data.role) {
      const _role = PUPIL_ROLE.find(ar => ar === data.role)
      if (!_role) {
        return { send: { msg: "error", err: "role incorect. use this: " + PUPIL_ROLE }, status: 400 };
      }
    }

    const school = await schoolModel.findById(classroom.schoolId);
    const currentSchoolYear = getCurrentObject(school.schoolYears);
    const periods = currentSchoolYear.periods;

    if (isEmpty(periods))
      return { send: { msg: "error", err: "Period is null in school" }, status: 404 };

    let notesByPeriod = [];

    for (const p of periods) {
      const periodObject = {
        periodId: p._id,
      };
      notesByPeriod.push(periodObject);
    }

    const pupil = classroom.pupils;
    const p = data?.pay ?? classroom.totalPrice;
    const d = {
      ...data,
      pay: p,
      notesByPeriod,
    };

    pupil.push(d);
    const c = await classroom.save();

    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", classroom: c }, status: 200 };

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
    let schoolYear, school;
    const classroom = (await this.getOne(id)).send.classroom;
    if(!classroom)
    return { send: { msg: "error", err: "classroom no found" }, status: 404 };

    if (data?.name)
      classroom.name = data.name

    if (data?.principalId)
      classroom.principalId = data.principalId

    if (data?.totalPrice) {
      classroom.totalPrice = data.totalPrice
      let deadlines = classroom.deadlines
      school = await schoolModel.findById(classroom.schoolId); // TODO create service to school

      if (data.schoolYearsId) {
        schoolYear = school.schoolYears.find((d) => d._id.equals(data.schoolYearsId));
      } else {
        const sy = school.schoolYears
        schoolYear = sy[sy.length - 1]
      }

      for (const d of deadlines) {
        d.price = (getObjectValue(d.periodId, schoolYear.deadlines).price / 100) * data.totalPrice
      }
    }

    if (data.matterId) {
      const matter = classroom.matters.find((m) => m._id.equals(data.matterId));
      if (!matter)
        return { send: { msg: "error", err: "matter no found" }, status: 404 };

      if (data.matterName) matter.name = data.matterName;

      if (data.matterCoef) matter.coef = data.matterCoef;

      if (data.matterTeacherId) {
        if (!getObjectValue(data.matterTeacherId, school.actors))
          return { send: { msg: "error", err: "matterTeacher no exist in school actor" }, status: 404 };
        matter.teacherId = data.matterTeacherId;
      }

      if (data.matterHoraire) matter.horaire = data.matterHoraire;
    }

    const c = await classroom.save();
    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", classroom: c }, status: 200 };

  } catch (error) {
    console.log("classroom_update error =>", error);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
}

module.exports.updatePupil = async (id, data) => {
  try {
    const classroom = (await this.getOne(id)).send.classroom;
    if(!classroom)
    return { send: { msg: "error", err: "classroom no found" }, status: 404 };
    const pupil = getObjectValue(data.pupilId, classroom.pupils);

    if (!pupil)
      return { send: { msg: "error", err: "pupil no found" }, status: 404 };

    if (data.lastname)
      pupil.lastname = data.lastname

    if (data.firstname)
      pupil.firstname = data.firstname

    if (data.birthCountry)
      pupil.birthCountry = data.birthCountry

    if (data.oldSchool)
      pupil.oldSchool = data.oldSchool

    if (data.birthday)
      pupil.birthday = data.birthday

    if (data.pay)
      pupil.pay = data.pay

    if (data.sanction)
      pupil.sanction = data.sanction

    if (data.average)
      pupil.average = data.average

    if (data.rank)
      pupil.rank = data.rank

    if (data.complement != null)
      pupil.complement = data.complement

      if (data.role) {
        const _role = PUPIL_ROLE.find(ar => ar === data.role)
        if (!_role) {
          return { send: { msg: "error", err:  "role incorect. use this: " + PUPIL_ROLE }, status: 400 };
        }
        pupil.role = data.role
      }

    if (data.noteByPeriodId) {
      const noteByPeriod = getObjectValue(data.noteByPeriodId, pupil.notesByPeriod)

      if (!noteByPeriod)
        return { send: { msg: "error", err: "noteByPeriod no found" }, status: 404 };

      const note = getObjectValue(data.noteId, noteByPeriod.notes)
      if (!note)
        return { send: { msg: "error", err: "noteByPeriod no found" }, status: 404 };
      if (data.noteValue) note.value = data.noteValue
      if (data.noteMatterId) note.matterId = data.noteMatterId
    }

    const c = await classroom.save();

    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };

    return { send: { msg: "success", pupil }, status: 200 };

  } catch (error) {
    console.log("classroom_updatePupil error =>", error);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }


}

const getObjectValue = (id, object) => {
  const d = object.find(d => d._id.equals(id))
  return d
}