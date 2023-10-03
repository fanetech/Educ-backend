
const Realm = require('realm');
exports.schoolYearSchema = {
    name: 'schoolYears',
    properties: {
      deviceId: 'objectId?',
      _id: { type: 'objectId', default: () => Realm.BSON.ObjectId() },
      __v: 'int?',
      fullYear: 'string',
      starYear: 'date',
      endYear: 'date',
      nDivision: 'int',
      division: 'string',
      periodIds: 'objectId[]',
      deadlineIds: 'objectId[]',
      classroomIds: 'objectId[]',
      createdAt: 'date?',
      updatedAt: 'date?',
    },
    primaryKey: '_id',
  };