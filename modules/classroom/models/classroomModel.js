
const Realm = require('realm');
exports.classroomSchema = {
  name: 'classroom',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    schoolYearId: 'objectId',
    name: 'string',
    totalPupils: { type: 'int', default: 0 },
    price: 'int',
    // todo add timetableIds
    teacherIds: 'objectId[]',
    deadlines: 'classroomDeadline[]',
    fileIds: 'objectId[]',
    absenceIds: 'objectId[]',
    matterIds: 'objectId[]',
    pupilIds: 'objectId[]',
    periodIds: 'objectId[]',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};

exports.classroomDeadlineSchema = {
  name: 'classroomDeadline',
  properties: {
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    name: 'string?',
    price: 'int?',
    classroomId: 'objectId?',
  },
  primaryKey: '_id',
};