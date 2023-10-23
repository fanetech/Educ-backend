const Realm = require('realm');
exports.schoolYearPeriodSchema = {
  name: 'schoolYearPeriod',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    schoolYearId: 'objectId',
    __v: 'int?',
    name: 'string',
    starDate: 'date',
    endDate: 'date',
    status: 'bool',
    nDivision: 'int',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};