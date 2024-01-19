exports.pupilAbsenceSchema = {
    name: 'pupilAbsence',
    properties: {
      deviceId: 'objectId?',
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      date: 'date',
      pupilId: 'objectId',
      justify: 'bool',
      raison: 'string?',
      createdAt: { type: 'date', default: new Date() },
      updatedAt: { type: 'date', default: new Date() },
    },
    primaryKey: '_id',
  };