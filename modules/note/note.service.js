const { realmQuery } = require("../../services/realmQuery");
const handleError = require("../../services/handleError");
const { STATUS_CODE, RETURN_STATUS } = require("../../services/constant");
const { getRealm } = require("../../config/realmConfig");
const { pupilSchema } = require("../pupils/models/pupil.model");
const { classroomMatterSchema } = require("../classroomMatter/models/classroomMatterModel");
const { noteSchema } = require("./models/note.model");
const { pupilPeriodSchema } = require("../pupilPeriod/models/pupilPeriod.model");
const { convertRealmObjectId } = require("../../utils/utils.tools");

module.exports.handleAddNote = (data, pupilPeriod) => {
    let noteCreated;
    const realm = getRealm();
    realm.write(() => {
        noteCreated = realm.create(noteSchema.name, {
            ...data,
            pupilPeriodId: convertRealmObjectId(data.pupilPeriodId),
            matterId: convertRealmObjectId(data.matterId),
            pupilId: convertRealmObjectId(data.pupilId)
        });
        pupilPeriod.noteIds.push(noteCreated._id);
    });
    return noteCreated
}

module.exports.create = async (data) => {
    try {
        const { pupilPeriodId, matterId, pupilId, noteNumber } = data;
        if (!pupilPeriodId || !matterId || !pupilId || !noteNumber) {
            return handleError.errorConstructor(STATUS_CODE.NOT_DATA);
        }
        const pupil = await realmQuery.getOne(pupilSchema.name, pupilId);
        if (!pupil) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.PUPIL_NOT_FOUND);
        }
        const matter = await realmQuery.getOne(classroomMatterSchema.name, matterId);
        if (!matter) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.PUPIL_PERIOD_NOT_FOUND);
        }
        const pupilPeriod = await realmQuery.getOne(pupilPeriodSchema.name, pupilPeriodId);
        if (!pupilPeriod) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.PUPIL_PERIOD_NOT_FOUND);
        }
        let periodCreated = this.handleAddNote(data, pupilPeriod)
        if (!periodCreated) {
            throw new Error("pupilPeriod_create_error");
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, periodCreated);
    } catch (error) {
        console.log("note_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getOne = async (id) => {
    try {
        const note = await realmQuery.getOne(noteSchema.name, id);
        if (!note) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.CLASSROOM_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, note);
    } catch (error) {
        console.log("note_getOne_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.getAll = async () => {
    try {
        const notes = await realmQuery.getAll(noteSchema.name);
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, notes);
    } catch (error) {
        console.log("note_getAll_error =>", error)
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}


module.exports.modify = async (id, data) => {
    try {
        let dataHandled = {};
        if(data.noteNumber){
            dataHandled.noteNumber = data.noteNumber
        }
        const noteUpdated = await realmQuery.upadte(noteSchema.name, id, dataHandled );
        if (!noteUpdated) {
            return handleError.errorConstructor(STATUS_CODE.NOT_FOUND, null, handleError.specificError.PUPIL_NOTE_NOT_FOUND);
        }
        return handleError.errorConstructor(STATUS_CODE.SUCCESS, noteUpdated);
    } catch (error) {
        console.log("pupil_update_error =>", error);
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
}

module.exports.remove = async (id) => {
    try {
      const returnData = await realmQuery.deleteAndUpdateArray( noteSchema.name, pupilPeriodSchema.name, 'noteIds', 'pupilPeriodId', id);
      if (!returnData) {
        throw new Error("note not deleted or not found");
      }    
      if(returnData === RETURN_STATUS.notEmpty){
        return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB, null, handleError.specificError.FIELD_NOT_EMPTY);
      }
      return handleError.errorConstructor(STATUS_CODE.SUCCESS, returnData);
    } catch (error) {
      console.log("note_remove_error =>", error)
      return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR);
    }
  }