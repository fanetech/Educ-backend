const { BSON, deleteFile } = require("realm");
const { SYNC_STORE_ID } = require("../atlasAppService/config");
const { getRealm } = require("../config/realmConfig");
const { customQuery } = require("./customQuery");
const handleError = require("../services/handleError");
const { STATUS_CODE, RETURN_STATUS } = require("./constant");
const { convertRealmObjectId } = require("../utils/utils.tools");

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
        try {
            const realm = getRealm();
            return realm.objectForPrimaryKey(schema, new BSON.ObjectId(id));
        } catch (error) {
            console.log("realmQuery.getOne error => ", error);
            return null;
        }
    },
    getAll: async (schema) => {
        const realm = getRealm();
        return await realm.objects(schema);
    },
    getWithQuery: (schema, query) => {
        const realm = getRealm();
        console.log(realm)
        return realm.objects(schema).filtered(query);
    },
    getWithQueryAndId: (schema, query, id) => {
        try {
            const realm = getRealm();
            return realm.objects(schema).filtered(query, BSON.ObjectId(id));            
        } catch (error) {
            console.log("getWithQueryAndId error => ", error);
            return 1;
        }
    },
    updateElseCreate: (schema, data) => {
        return realm.write(() => {
            realm.create(schema, data, "modified");
        });
    },
    upadte: (schema, id, data) => {
        try {
            const realm = getRealm();
            let dataToSend;
            const bsnId = new BSON.ObjectId(id);
            const dataToUpdate = realm.objectForPrimaryKey(schema, bsnId);
            if (dataToUpdate?.length < 1) {
                return null;
            }
            realm.write(() => {
                dataToSend = realm.create(schema, { _id: bsnId, ...data }, "modified");
            });
            return dataToSend;
        } catch (error) {
            console.log("realmQuery.update error => ", error);
            return null;
        }
    },
    delete: (schema, id) => {
        try {
            const realm = getRealm();
            const data = realm.objectForPrimaryKey(schema, new BSON.ObjectId(id));
            if (!data) {
                return false;
            }
            realm.write(() => {
                realm.delete(data);
            });
            return true;
        } catch (error) {
            console.log("realmQuery.delete error => ", error);
            return false;
        }
    },
    deleteAndUpdateArray: (schemaToDelede, schemaToUpdate, fieldArray, fieldDelete, id, checkArrayField = []) => {
        try {
            const realm = getRealm();
            const deleteData = realm.objectForPrimaryKey(schemaToDelede, new BSON.ObjectId(id));
            const updateData = realm.objectForPrimaryKey(schemaToUpdate, new BSON.ObjectId(deleteData[fieldDelete]));
            if (!deleteData || !updateData) {
                return false;
            }
            if (checkArrayField.length > 0) {
                for (const field of checkArrayField) {
                    if (deleteData[field]?.length > 0) {
                        return RETURN_STATUS.notEmpty;
                    }
                }
            }
            realm.write(() => {
                const index = updateData[fieldArray].indexOf(deleteData._id);
                if (index !== -1) updateData[fieldArray].splice(index, 1);
                realm.delete(deleteData);
            });
            return true;
        } catch (error) {
            console.log("realmQuery.deleteAndUpdateArray error => ", error);
            return false;
        }
    },
    getDataByCustomQuery: async (schema, fieldQuery, value) => {
        try {
            const realm = getRealm();
            const handleValue = value?.length > 0 ? [...value] : [value]
            return await realm.objects(schema).filtered(`${fieldQuery} IN $0`, handleValue);
        } catch (error) {
            console.log("realmQuery.getDataByCustomQuery error => ", error);
            return null;
        }
    },
    updateSchemaArray: async (schema, updateObjectId, pushObjectId, fieldArray, classroomId) => {
        try {
            const realm = getRealm();
            const objectToUpdate = realm.objectForPrimaryKey(schema, convertRealmObjectId(updateObjectId));
            const objectToPush = realm.objectForPrimaryKey(schema, convertRealmObjectId(pushObjectId));
            realm.write(() => {
                const index = objectToUpdate[fieldArray].indexOf(classroomId);
                if (index !== -1) objectToUpdate[fieldArray].splice(index, 1);
                objectToPush[fieldArray].push(classroomId);
            }, "modified");
            return true;
        } catch (error) {
            console.log("realmQuery.getDataByCustomQuery error => ", error);
            return false;
        }
    }
}