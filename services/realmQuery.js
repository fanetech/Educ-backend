const { BSON } = require("realm");
const { SYNC_STORE_ID } = require("../atlasAppService/config");
const { getRealm } = require("../config/realmConfig");
const { customQuery } = require("./customQuery");
const handleError = require("../services/handleError");
const { STATUS_CODE } = require("./constant");

exports.realmQuery = {
    add: async (schema, data) => {
        try {
            const realm = getRealm();
            let dataToSend;
            if (realm) {
                realm.write(() => {
                    dataToSend = realm.create(schema, data);
                });
                return handleError.errorConstructor(STATUS_CODE.SUCCESS, dataToSend);
            } else {
                return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB);
            }
        } catch (error) {
            console.log("realmQuery.add error => ", error);
            return handleError.errorConstructor(STATUS_CODE.UNEXPECTED_ERROR_DB);
        }
    },
    getOne: (schema, id) => {
        const realm = getRealm();
        return realm.objectForPrimaryKey(schema, new BSON.ObjectId(id));
    },
    getAll: async (schema) => {
        const realm = getRealm();

        return await realm.objects(schema);
    },
    getWithQuery: (schema, query) => {
        const realm = getRealm();
        return realm.objects(schema).filtered(query);
    },
    update: (schema, data) => {
        return realm.write(() => {
            realm.create(schema, data, "modified");
        });
    },
    delete: (schema, id) => {
        const data = realm.objectForPrimaryKey(schema, new BSON.ObjectId(id));
        if (data.length < 1) {
            return false;
        }
        return realm.write(() => {
            realm.delete(data);
        });
    },
}