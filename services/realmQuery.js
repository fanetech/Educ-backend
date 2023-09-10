const { SYNC_STORE_ID } = require("../atlasAppService/config");
const { getRealm } = require("../config/realmConfig");

exports.realmQuery = {
    add: (schema, data) => {
        const realm = getRealm();
        console.log(realm)
        let dataToSend;

        realm.write(() => {
            dataToSend = realm.create(schema, data);
        });
        return dataToSend;
    },
    getOne: (schema, id) => {
        return realm.objectForPrimaryKey(schema, new BSON.ObjectId(id));
    },
    getAll: async (schema) => {
        const realm = getRealm();
        return await realm.objects(schema).filtered('storeId = $0', SYNC_STORE_ID);        
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