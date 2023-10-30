const Realm = require('realm');
exports.classroomTeacherSchema = {
  name: 'classroomTeachers',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    actorId: 'objectId',
    isPrincipal: { type: 'bool', default: false },
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};