const Realm = require('realm');
exports.schoolYearDeadlineSchema = {
    name: 'schoolYearDeadline',
    properties: {
      deviceId: 'objectId?',
      _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
      schoolYearId:'objectId',
      __v: 'int?',
      name: 'string',
      starDate: 'date',
      endDate: 'date',
      priceInPercent: 'int',
      nDivision: 'int',
      createdAt: 'date?',
      updatedAt: 'date?',
    },
    primaryKey: '_id',
  };