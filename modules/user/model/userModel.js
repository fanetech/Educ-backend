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


exports.userSchema = {
  name: 'user',
  properties: {
    storeId: { type: 'objectId', indexed: true },
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
    schools: 'user_schools',
    updatedAt: 'date?',
    userName: 'string?',
  },
  primaryKey: '_id',
};

exports.user_schoolsSchema = {
    name: 'user_schools',
    embedded: true,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      role: 'string?',
      schoolId: 'objectId?',
      status: 'bool?',
    },
  };
