const Realm = require('realm');

exports.classroomMatterSchema = {
  name: 'classroomMatters',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    classroomId: 'objectId',
    name: 'string',
    coef: 'int',
    teacherId: "objectId?",
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};