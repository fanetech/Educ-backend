
const Realm = require('realm');
exports.schoolActorSchema = {
    name: 'school_actors',
    properties: {
        deviceId: 'objectId?',
        _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
        __v: 'int?',
        role: 'string',
        actif: 'bool',
        userId: 'objectId',
        schoolId: 'objectId',
        createdAt: 'date?',
        updatedAt: 'date?',
    },
    primaryKey: '_id',
};