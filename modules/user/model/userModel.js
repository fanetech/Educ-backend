exports.userModel = {
    name: "user",
    primaryKey: "_id",
    properties: {
        _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
        username: 'string',
        firstname: "string",
        lastname: "string",
        number: 'string',
        email: "string",
        role: "bool",
        adress: "string",
        password: "string",
        createdAt: {type: 'date', default: new Date()},
        updatedAt: {type: 'date', default: new Date()},
    },
    indexed: ['username', 'number', 'email'],
}