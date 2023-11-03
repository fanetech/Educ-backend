
const Realm = require('realm');

exports.pupilSchema = {
  name: 'pupil',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    classroomId: 'objectId',
    lastname: 'string',
    firstname: 'string',
    birthCountry: 'string?',
    oldSchool: 'string?',
    birthday: 'date?',
    payed: { type: 'int', default: 0 },
    sanction: { type: 'int', default: 0 },
    TotalAverage: 'int?',
    TotalRank: 'int?',
    complement: { type: 'bool', default: false },
    role: { type: 'string', default: 'none' },
    periodIds: 'objectId[]',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};
