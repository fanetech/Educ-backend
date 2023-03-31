const classroomModel = require("../../models/classroum.model");
const { isEmpty } = require("../../utils/utils.tools");
const schoolModel = require("../../models/school.model");
const { PUPIL_ROLE, BOOL } = require("../../services/constant");
const { default: mongoose } = require("mongoose");
const { classroomError } = require("../../utils/utils.errors");
const utilsTools = require("../../utils/utils.tools")
const schoolService = require('../school/school.services')

module.exports.create = async (data) => {

  let schoolYear, school;
  const _classroom = (await this.getByName(data.name))
  if(_classroom?.send?.classroom){
    return { send: { msg: "error", err: "name is exist" }, status: 404 };
  }

  try {
    const _school = await schoolService.getOne(data.schoolId);
    if(!_school?.send?.docs){
      return _school
    }
    school = _school?.send?.docs

    if (data?.schoolYearId) {
      schoolYear = getObjectValue(data?.schoolYearId, school?.schoolYears)
    } else {
      schoolYear = getCurrentObject(school?.schoolYears)
    }

  } catch (err) {
    console.log("classroom_create_get_school_error", err)
    return { send: { msg: "error", err: "school no found" }, status: 404 };
  }

  if (!schoolYear)
    return { send: { msg: "error", err: "schoolYear is null" }, status: 404 };

  const session = await mongoose.startSession();
  session.startTransaction()
  try {
    let deadlines = data?.deadlines;
    const schoolDeadlines = schoolYear.deadlines;
    if (isEmpty(deadlines)) {
      if (isEmpty(schoolDeadlines)) {
        return { send: { msg: "error", err: "deadlines no found in school year" }, status: 400 };
      } else {
        let d = [];
        for (const sd of schoolDeadlines) {
          const deadlinesObject = {
            periodId: sd?._id,
            price: (sd?.price / 100) * data.price,
          };
          d.push(deadlinesObject);
        }
        deadlines = d;
      }
    }
    const newClassroom = await classroomModel.create(
      {
        name: data.name,
        totalPrice: data.price,
        schoolId: data.schoolId,
        deadlines,
      },
    );
    if (isEmpty(newClassroom))
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    schoolYear.classroomIds.push(newClassroom._id);
    const s = await school.save();
    const classroom = await newClassroom.save(); // TODO delete if failled
    await session.commitTransaction();
    session.endSession()
    if (classroom) {
      return { send: { msg: "success", docs: classroom }, status: 200 };
    } else {
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    }
  } catch (err) {
    session.endSession()
    session.abortTransaction()
    console.log("classroom_create_error =>", err);
    return { send: { msg: "error", err: classroomError(err) }, status: 500 };
  }
}

module.exports.getAll = async () => {
  const classroums = await classroomModel.find().sort({ createdAt: -1 });
  if (classroums) return { send: { msg: "success", docs: classroums }, status: 200 };
  else return { send: { msg: "error", err: "Internal error" }, status: 500 };
};

// TODO
module.exports.getOne = async (id) => {
  try {
    if(!utilsTools.checkParams(id)){
      return { send: { msg: "error", err: "internal error" }, status: 500 }; 
  }
    const classroom = await classroomModel.findById(id);
    if (classroom) return { send: { msg: "success", docs: classroom }, status: 200 }
    else {
      return { send: { msg: "error", err: "Internal error" }, status: 404 };
    }
  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: err }, status: 500 };
  }
};

module.exports.getByName = async (name) => {
  try {
    const classroom = await classroomModel.findOne({name: name});
    if (classroom) return { send: { msg: "success", docs: classroom }, status: 200 };
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

    if (!getObjectValue(data.matterId, classroom.matters))
      return { send: { msg: "error", err: "matter no found" }, status: 404 };

    const m = noteByPeriod.notes.find(d => d.matterId === data.matterId)
    if (m)
      return { send: { msg: "error", err: "matter existe" }, status: 404 };

    noteByPeriod.notes.push(data);

    const c = await classroom.save();
    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };

    return { send: { msg: "success", docs: getCurrentObject(noteByPeriod.notes) }, status: 200 };

  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

module.exports.matter = async (id, data) => {
  try {
    const classroom = await (await this.getOne(id)).send.docs;

    if (!classroom)
      return { send: { msg: "error", err: "class no found" }, status: 404 };

    const checkName = classroom.matters.find(m => m.name.toLowerCase() === data?.name.toLowerCase())
    if (checkName)
      return { send: { msg: "error", err: "name existe" }, status: 404 };

    classroom.matters.push(data);
    const c = await classroom.save();

    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", docs: getCurrentObject(classroom.matters) }, status: 200 };

  } catch (err) {
    console.log("classroom_matter_error =>", err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

module.exports.absence = async (id, data) => {
  try {
    const classroom = (await this.getOne(id)).send.docs;

    if (!classroom)
      return { send: { msg: "error", err: "class no found" }, status: 404 };

    const absences = classroom.absences;

    absences.push(data)
    const a = await classroom.save();

    if (!a)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", docs: getCurrentObject(classroom.absences) }, status: 200 };

  } catch (error) {
    console.log("classroom_absence_error =>", error);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
}
module.exports.addAbsence = async (id, data) => {
  try {
    const classroom = (await this.getOne(id)).send.docs;

    if (!classroom)
      return { send: { msg: "error", err: "class no found" }, status: 404 };

    const absence = getObjectValue(data.absenceId, classroom.absences);
    if (!absence)
      return { send: { msg: "error", err: "absence no found" }, status: 404 };

    let pupils = absence.pupils;
    for (const p of data.pupils) {
      pupils.push(p)
    }
    const a = await classroom.save();

    if (!a)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };
    return { send: { msg: "success", docs: getObjectValue(data.absenceId, classroom.absences) }, status: 200 };

  } catch (error) {
    console.log("classroom_add_absence_error =>", error);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
}

module.exports.pupil = async (id, data) => {
  try {
    const classroom = await (await this.getOne(id)).send.docs;
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
    let currentSchoolYear;
    if (data.schoolYearId) {
      currentSchoolYear = getObjectValue(data.schoolYearId, school.schoolYears)
    } else {
      currentSchoolYear = getCurrentObject(school.schoolYears);
    }
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
    return { send: { msg: "success", docs: getCurrentObject(c.pupils) }, status: 200 };

  } catch (err) {
    console.log(err);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
};

module.exports.update = async (id, data) => {
  try {
    let schoolYear, school;
    const classroom = (await this.getOne(id)).send.docs;
    if (!classroom)
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
    return { send: { msg: "success", docs: c }, status: 200 };

  } catch (error) {
    console.log("classroom_update error =>", error);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
}

module.exports.updatePupil = async (id, data) => {
  try {
    const classroom = (await this.getOne(id)).send.docs;
    if (!classroom)
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
        return { send: { msg: "error", err: "role incorect. use this: " + PUPIL_ROLE }, status: 400 };
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

    return { send: { msg: "success", docs: pupil }, status: 200 };

  } catch (error) {
    console.log("classroom_updatePupil error =>", error);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }
}

module.exports.updateAbsence = async (id, data) => {
  try {
    let pupil
    const classroom = (await this.getOne(id)).send.docs;
    if (!classroom)
      return { send: { msg: "error", err: "classroom no found" }, status: 404 };

    const absence = getObjectValue(data.absenceId, classroom.absences);
    if (!absence)
      return { send: { msg: "error", err: "absence no found" }, status: 404 };

    if (data.date)
      absence.date = data.date;

    if (data.timeNumber)
      absence.timeNumber = data.timeNumber

    if (data.reason || data.justify != null) {
      pupil = getObjectValue(data.pupilId, absence.pupils);
      if (!pupil)
        return { send: { msg: "error", err: "pupil no found" }, status: 404 };

      if (data.reason)
        pupil.reason = data.reason

      if (data.justify != null) {
        const _justify = BOOL.find(b => b === data.justify)
        if (!_justify) {
          return { send: { msg: "error", err: "error", err: "boolean incorect. use this: " + BOOL }, status: 500 };
        }
        pupil.justify = data.justify
      }
    }

    const c = await classroom.save();

    if (!c)
      return { send: { msg: "error", err: "Internal error" }, status: 500 };

    return { send: { msg: "success", docs: absence }, status: 200 };

  } catch (error) {
    console.log("classroom_updateAbsence error =>", error);
    return { send: { msg: "error", err: "Internal error" }, status: 500 };
  }


}

const getObjectValue = (id, object) => {
  const d = object.find(d => d._id.equals(id))
  return d
}

const getCurrentObject = (array) => {
  if (isEmpty(array))
    return { send: { msg: "error", err: "array is null" }, status: 404 };
  return array[array.length - 1];
};