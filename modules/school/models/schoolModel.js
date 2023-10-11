
const Realm = require('realm');
exports.schoolSchema = {
    name: 'schools',
    properties: {
      deviceId: 'objectId?',
      _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
      __v: 'int?',
      founderId: 'objectId',
      schoolName: 'string',
      slogan: 'string?',
      adress: 'string?',
      email: 'string?',
      phone: 'string?',
      actorIds: 'objectId[]',
      libraryIds: 'objectId[]',
      schoolYearIds: 'objectId[]',
      settingIds: 'objectId[]',
      createdAt: 'date?',
      updatedAt: 'date?',
    },
    primaryKey: '_id',
  };