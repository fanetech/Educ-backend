// exports.userModel = {
//     name: "user",
//     primaryKey: "_id",
//     properties: {
//         _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
//         username: 'string',
//         firstname: "string",
//         lastname: "string",
//         number: 'string',
//         email: "string",
//         role: "bool",
//         adress: "string",
//         password: "string",
//         createdAt: {type: 'date', default: new Date()},
//         updatedAt: {type: 'date', default: new Date()},
//     },
//     indexed: ['username', 'number', 'email'],
// }

const { SYNC_STORE_ID } = require("../../../atlasAppService/config");


exports.userSchema = {
  name: 'users',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
    __v: 'int?',
    adress: 'string?',
    createdAt: 'date?',
    email: 'string?',
    firstName: 'string?',
    lastName: 'string?',
    number: 'string?',
    password: 'string',
    role: 'string?',
    schools: 'objectId[]',
    updatedAt: 'date?',
    userName: 'string?',
  },
  primaryKey: '_id',
};

exports.user_schoolsSchema = {
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

  exports.test = {
    name: 'tests',
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      name: 'string?',
      storeId: { type: 'objectId', indexed: true , default: SYNC_STORE_ID},
    },
    primaryKey: '_id',
  };
