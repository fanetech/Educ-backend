
const Realm = require('realm');

exports.classroomPeriodSchema = {
  name: 'classroomPeriod',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    classroomId: 'objectId',
    schoolYearPeriodId: 'objectId',
    noteIds: 'objectId[]',
    absenceIds: 'objectId[]',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};
