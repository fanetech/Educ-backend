exports.userSchoolSchema = {
    name: 'users_schools',
    // embedded: true,
    properties: {
      deviceId: 'objectId?',
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId()},
      role: 'string?',
      schoolId: 'objectId?',
      status: 'bool?',
      userId: 'objectId'
    },
    primaryKey: '_id',
  };