const classroomModel = require("../../models/classroum.model");
const { isEmpty } = require("../../utils/utils.tools");
const schoolModel = require("../../models/school.model");
const { PUPIL_ROLE, BOOL, STATUS_CODE } = require("../../services/constant");
const { default: mongoose } = require("mongoose");
const { classroomError } = require("../../utils/utils.errors");
const utilsTools = require("../../utils/utils.tools")
const schoolService = require('../school/school.services')
const handleError = require('../../services/handleError')
const userService = require('../user/user.service')

module.exports.create = async (data) => {

  let schoolYear, school;

  const _classroom = await this.getByName(data.name)
  if (_classroom) {
    return handleError.errorConstructor(STATUS_CODE.DATA_EXIST, null, "nom de l'établissement");
  }

  try {
    const _school = await schoolService.getOne(data.schoolId);
    if (!_school?.send?.docs) {
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
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }

  if (!schoolYear) {

    return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "année scolaire");
  }

  const session = await mongoose.startSession();
  session.startTransaction()
  try {
    let deadlines = data?.deadlines;
    const schoolDeadlines = schoolYear.deadlines;
    if (isEmpty(deadlines)) {
      if (isEmpty(schoolDeadlines)) {
        return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "écheance de paiement");
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
    if (isEmpty(newClassroom)) {

      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }

    schoolYear.classroomIds.push(newClassroom._id);

    const s = await school.save();

    const classroom = await newClassroom.save(); // TODO delete if failled

    await session.commitTransaction();
    session.endSession()

    if (classroom) {

      return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroom);

    } else {

      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);

    }
  } catch (err) {
    session.endSession()
    session.abortTransaction()
    console.log("classroom_create_error =>", err);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.getAll = async () => {
  const classrooms = await classroomModel.find().sort({ createdAt: -1 });
  if (classrooms) return handleError.errorConstructor(STATUS_CODE.SUCCESS, classrooms);
  else return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
};

module.exports.getOne = async (id) => {
  try {
    if (!utilsTools.checkParams(id)) {
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
    }

    const classroom = await classroomModel.findById(id);
    if (classroom) return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroom)

    else {
      throw handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
    }
  } catch (err) {
    console.log("classroom_getOne_error", err);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
  }
};

module.exports.getByName = async (name) => {
  try {
    const classroom = await classroomModel.findOne({ name: name });

    if (classroom) return handleError.errorConstructor(STATUS_CODE.SUCCESS, classroom)
    else {
      return null
    }
  } catch (err) {
    console.log(err);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
  }
};

module.exports.note = async (id, pupilId, noteByPeriodId, data) => {
  try {
    const classroom = await classroomModel.findById(id);
    if (!classroom)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement")

    const pupil = classroom.pupils.find((p) => p._id.equals(pupilId));
    if (!pupil)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "élève")

    const noteByPeriod = pupil.notesByPeriod.find((n) => n._id.equals(noteByPeriodId));
    if (!noteByPeriod)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "période")

    if (!getObjectValue(data.matterId, classroom.matters))
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "matière")

    noteByPeriod.notes.push(data);

    const c = await classroom.save();
    if (!c)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)

    return handleError.errorConstructor(STATUS_CODE.SUCCESS, getCurrentObject(noteByPeriod.notes))

  } catch (err) {
    console.log(err);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
  }
};

module.exports.matter = async (id, data) => {
  try {
    const classroom = await (await this.getOne(id)).send.docs;

    if (!classroom)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "classe")

    const checkName = checkMatter(classroom.matters, data?.name)
    if (checkName)
      return handleError.errorConstructor(STATUS_CODE.DATA_EXIST, null, "nom de la matière")

    classroom.matters.push(data);
    const c = await classroom.save();

    if (!c)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, getCurrentObject(classroom.matters))

  } catch (err) {
    console.log("classroom_matter_error =>", err);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
  }
};

module.exports.teacher = async (id, data) => {

  try {

    const { teacherId } = data

    if (!teacherId) {
      return handleError.errorConstructor(STATUS_CODE.DATA_REQUIS, null, "professeur")
    }

    const classroom = await (await this.getOne(id)).send.docs;

    if (!classroom) {

      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "classe")
    }

    const school = await (await schoolService.getOne(classroom.schoolId)).send.docs

    if (!school) {
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement")
    }

    if (!getObjectValue(teacherId, school.actors)) {
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "ce professeur n'existe pas dans l'établissement")
    }

    const teacher = classroom.teachers.find(t => t.teacherId === teacherId)
    if (teacher) {
      return handleError.errorConstructor(STATUS_CODE.DATA_EXIST, null, "ce professeur existe déjà dans la classe")
    }

    const d = {
      teacherId,
      isPincipal: data.isPincipal
    }

    classroom.teachers.push(d);

    const c = await utilsTools.save(classroom, getCurrentObject(classroom.teachers))

    return c;

  } catch (error) {

    console.log("classroom_service_teacher_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
  }
}

module.exports.absence = async (id, data) => {
  try {
    const classroom = (await this.getOne(id)).send.docs;

    if (!classroom)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "classe")

    const absences = classroom.absences;

    absences.push(data)
    const a = await classroom.save();

    if (!a) {

      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
    }
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, getCurrentObject(classroom.absences))

  } catch (error) {
    console.log("classroom_absence_error =>", error);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
  }
}
module.exports.addAbsence = async (id, data) => {
  try {
    const classroom = (await this.getOne(id)).send.docs;

    if (!classroom)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)

    const absence = getObjectValue(data.absenceId, classroom.absences);
    if (!absence)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "absence")

    let pupils = absence.pupils;
    for (const p of data.pupils) {
      pupils.push(p)
    }
    const a = await classroom.save();

    if (!a) {

      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
    }

    return handleError.errorConstructor(STATUS_CODE.SUCCESS, getObjectValue(data.absenceId, classroom.absences))

  } catch (error) {

    console.log("classroom_add_absence_error =>", error);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)
  }
}

module.exports.pupil = async (id, data) => {
  try {
    const classroom = await (await this.getOne(id)).send.docs;
    if (!classroom) {

      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "classe")
    }

    classroom.totalPupil = classroom.totalPupil + 1

    const matters = classroom?.matters;
    if (isEmpty(matters))
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "matière");

    if (data.role) {
      const _role = PUPIL_ROLE.find(ar => ar === data.role)
      if (!_role) {
        return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "role incorect, utiliser " + PUPIL_ROLE.toString());
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

    if (isEmpty(periods)) {

      return handleError.errorConstructor(STATUS_CODE.NOT_DATA, null, "aucune periode dans votre établissement");
    }

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

    if (!c) {

      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }

    return handleError.errorConstructor(STATUS_CODE.SUCCESS, getCurrentObject(c.pupils));

  } catch (err) {
    console.log(err);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
};

module.exports.update = async (id, data) => {
  try {
    let schoolYear, school;
    const classroom = (await this.getOne(id)).send.docs;
    if (!classroom)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "classe");

    if (data?.name) {
      const _classroom = await this.getByName(data.name)
      if (_classroom) {
        return handleError.errorConstructor(STATUS_CODE.DATA_EXIST, null, "nom de l'établissement");
      }

      classroom.name = data.name
    }

    if (data?.principalId) {

      const school = (await schoolService.getOne(classroom.schoolId))?.send?.docs
      if (!getObjectValue(data.principalId, school.actors)) {
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "utilisateur n'existe pas dans le personnel");
      }

      classroom.principalId = data.principalId
    }

    if (data?.totalPrice) {

      classroom.totalPrice = data.totalPrice

      let deadlines = classroom.deadlines

      school = (await schoolService.getOne(classroom.schoolId))?.send?.docs;

      if (!school) {
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement")
      }

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
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "matière");

      if (data.matterName) matter.name = data.matterName;

      if (data.matterCoef) matter.coef = data.matterCoef;

      if (data.matterTeacherId) {
        if (!getObjectValue(data.matterTeacherId, school.actors)) {

          return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "l'établissement ne contient pas de professeur pour cette matière")
        }

        matter.teacherId = data.matterTeacherId;
      }

      if (data.matterHoraire) matter.horaire = data.matterHoraire;
    }

    const c = await classroom.save();
    if (!c)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    return handleError.errorConstructor(STATUS_CODE.SUCCESS, c);

  } catch (error) {
    console.log("classroom_update error =>", error);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.updateMatter = async (id, data) => {

  const classroom = (await this.getOne(id)).send.docs;
  if (!classroom)
    return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "classe");

  const matter = classroom.matters.find((m) => m._id.equals(data.matterId));
  if (!matter)
    return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "matière");

  if (data.name) {
    const checkName = checkMatter(classroom.matters, data.name)
    if (checkName) {
      return handleError.errorConstructor(STATUS_CODE.DATA_EXIST, null, "nom de matière");
    }
    matter.name = data.name;
  }

  if (data.coef) matter.coef = data.coef;

  if (data.teacherId) {

    const school = (await schoolService.getOne(classroom.schoolId))?.send?.docs;
    if (!school) {
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement")
    }

    if (!getObjectValue(data.teacherId, school.actors)) {

      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "l'établissement ne contient pas de professeur pour cette matière")
    }

    matter.teacherId = data.teacherId;
  }

  if (data.horaire) matter.horaire = data.horaire;

  return handleError.errorConstructor(STATUS_CODE.SUCCESS, matter);
}

module.exports.updatePupil = async (id, data) => {
  try {
    const classroom = (await this.getOne(id)).send.docs;
    if (!classroom)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "classe");

    const pupil = getObjectValue(data.pupilId, classroom.pupils);

    if (!pupil)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "élève");

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
        return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "role incorect. utiliser " + PUPIL_ROLE.toString());
      }

      pupil.role = data.role
    }

    if (data.noteByPeriodId) {
      const noteByPeriod = getObjectValue(data.noteByPeriodId, pupil.notesByPeriod)

      if (!noteByPeriod)
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "note de periode");

      const note = getObjectValue(data.noteId, noteByPeriod.notes)
      if (!note)
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "note");

      if (data.noteValue) note.value = data.noteValue

      if (data.noteMatterId) {
        const matter = getObjectValue(data.noteMatterId, classroom.matters);
        if (!matter)
          return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "matière");

        note.matterId = data.noteMatterId
      }

    }

    const c = await classroom.save();

    if (!c)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR)

    return handleError.errorConstructor(STATUS_CODE.SUCCESS, pupil);

  } catch (error) {
    console.log("classroom_updatePupil error =>", error);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }
}

module.exports.updateAbsence = async (id, data) => {
  try {
    let pupil
    const classroom = (await this.getOne(id)).send.docs;
    if (!classroom)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "classe");

    const absence = getObjectValue(data.absenceId, classroom.absences);
    if (!absence)
      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "absence");

    if (data.date)
      absence.date = data.date;

    if (data.timeNumber)
      absence.timeNumber = data.timeNumber

    if (data.reason || data.justify != null) {
      pupil = getObjectValue(data.pupilId, absence.pupils);
      if (!pupil)
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "élève");

      if (data.reason)
        pupil.reason = data.reason

      if (data.justify != null) {
        const _justify = BOOL.find(b => b === data.justify)
        if (!_justify) {
          return handleError.errorConstructor(STATUS_CODE.DATA_INCORRECT, null, "boolean incorect. utiliser " + BOOL);
        }
        pupil.justify = data.justify
      }
    }

    const c = await classroom.save();

    if (!c)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);

    return handleError.errorConstructor(STATUS_CODE.SUCCESS, absence);

  } catch (error) {

    console.log("classroom_updateAbsence error =>", error);
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }


}

module.exports.updateTeacher = async (id, data) => {
  try {

    const { teacherId, isPrincipal, classroomTeacherId } = data

    const classroom = (await this.getOne(id)).send.docs;
    if (!classroom) {

      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "classe");
    }

    const theTeacher = getObjectValue(classroomTeacherId, classroom.teachers)
    if (!theTeacher) {

      return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "ce professeur n'existe pas dans la liste des professeurs de la classe");
    }

    if (teacherId) {

      const teacher = classroom.teachers.find(t => t.teacherId === teacherId)

      if (teacher) {
        return handleError.errorConstructor(STATUS_CODE.DATA_EXIST, null, "ce professeur existe déjà dans la classe")
      }

      const school = await (await schoolService.getOne(classroom.schoolId)).send.docs

      if (!school) {
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "établissement")
      }

      if (!getObjectValue(teacherId, school.actors)) {
        return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, "ce professeur n'existe pas dans l'établissement")
      }

      theTeacher.teacherId = teacherId;

    }

    if (isPrincipal !== null) {
      theTeacher.isPrincipal = isPrincipal
    }

    return await utilsTools.save(classroom, theTeacher)

  } catch (error) {
    console.log("classroum_service_updateTeacher_error =>", error)
    return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
  }

}

const getObjectValue = (id, object) => {
  const d = object.find(d => d._id.equals(id))
  return d
}

const getCurrentObject = (array) => {
  if (isEmpty(array))
    return null;
  return array[array.length - 1];
};

const checkMatter = (matters, name) => {
  return matters.find(m => m.name.toLowerCase() === name.toLowerCase())
}