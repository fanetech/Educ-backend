const { SYNC_STORE_ID } = require("../../../atlasAppService/config");
const Realm = require("realm");

exports.userSchema = {
  name: 'users',
  properties: {
    deviceId: 'objectId?',
    _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
    __v: 'int?',
    adress: 'string?',
    createdAt: 'date?',
    email: 'string?',
    firstName: 'string?',
    lastName: 'string?',
    number: 'string?',
    password: 'string',
    role: 'string?',
    schoolIds: 'objectId[]',
    updatedAt: 'date?',
    userName: 'string?',
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
