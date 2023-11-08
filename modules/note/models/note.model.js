
const Realm = require('realm');

exports.noteSchema = {
  name: 'note',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    pupilPeriodId: 'objectId',
    matterId: 'objectId',
    pupilId: 'objectId',
    noteNumber: 'int?',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};
