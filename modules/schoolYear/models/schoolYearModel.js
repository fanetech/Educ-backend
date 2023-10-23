
const Realm = require('realm');
exports.schoolYearSchema = {
  name: 'schoolYears',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    schoolId: 'objectId',
    __v: 'int?',
    fullYear: 'string',
    starYear: 'date',
    endYear: 'date',
    nDivision: 'int',
    division: 'string',
    periodIds: 'objectId[]',
    deadlineIds: 'objectId[]',
    classroomIds: 'objectId[]',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};