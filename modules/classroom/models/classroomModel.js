
const Realm = require('realm');
exports.classroomSchema = {
  name: 'classroom',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    schoolYearId: 'objectId',
    name: 'string',
    totalPupil: { type: 'int', default: 0 },
    price: 'int',
    // todo add timetableIds
    teacherIds: 'objectId[]',
    deadlineIds: 'objectId[]',
    fileIds: 'objectId[]',
    absenceIds: 'objectId[]',
    matterIds: 'objectId[]',
    pupilIds: 'objectId[]',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};