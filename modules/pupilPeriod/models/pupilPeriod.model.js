
const Realm = require('realm');

exports.pupilPeriodSchema = {
  name: 'pupilPeriod',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    pupilId: 'objectId',
    schoolYearPeriodId: 'objectId',
    noteIds: 'objectId[]',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};
