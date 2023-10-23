exports.userSchoolSchema = {
  name: 'users_schools',
  // embedded: true,
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
    role: 'string?',
    schoolId: 'objectId?',
    status: 'bool?',
    userId: 'objectId',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};