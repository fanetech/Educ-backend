const Realm = require("realm");

exports.userSchema = {
  name: 'users',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    adress: 'string?',
    email: 'string?',
    firstName: 'string?',
    lastName: 'string?',
    number: 'string?',
    password: 'string',
    role: 'string?',
    schoolIds: 'objectId[]',    
    userName: 'string?',
    createdAt: { type: 'date', default: new Date() },
    updatedAt: { type: 'date', default: new Date() },
  },
  primaryKey: '_id',
};
