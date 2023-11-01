const Realm = require('realm');
// Realm.flags.THROW_ON_GLOBAL_REALM = false;
const { userSchema } = require('../modules/user/model/userModel');
const { userSchoolSchema } = require('../modules/userSchool/models/userSchoolModel');
const { getAtlasApp } = require('../atlasAppService/getAtlasApp');
const { SYNC_STORE_ID } = require('../atlasAppService/config');
const { schoolSchema } = require('../modules/school/models/schoolModel');
const { schoolActorSchema } = require('../modules/schoolActor/models/schoolActorModel');
const { schoolYearSchema } = require('../modules/schoolYear/models/schoolYearModel');
const { schoolYearPeriodSchema } = require('../modules/schoolYearPeriod/models/schoolYearPeriodModel');
const { schoolYearDeadlineSchema } = require('../modules/deadline/models/schoolYearDeadlineModel');
const { classroomSchema } = require('../modules/classroom/models/classroomModel');
const { classroomTeacherSchema } = require('../modules/classroomTeacher/models/classroomTeacherModel');
const { classroomMatterSchema } = require('../modules/classroomMatter/models/classroomMatterModel');

let app = getAtlasApp();
let realm;
let currentUser = null;
let originalAccessToken = null;
const behaviorConfiguration = {
  type: "openImmediately",
};

function getRealm() {
  return realm;
}

const openRealm = async () => {
  try {
    realm = await Realm.open({
      schema: [userSchema, userSchoolSchema, schoolSchema, schoolActorSchema, schoolYearSchema, schoolYearPeriodSchema, schoolYearDeadlineSchema, classroomSchema, classroomTeacherSchema, classroomMatterSchema],
      // schemaVersion: 1,
      sync: {
        user: app.currentUser,
        flexible: true,
        newRealmFileBehavior: behaviorConfiguration,
        existingRealmFileBehavior: behaviorConfiguration,
        initialSubscriptions: {
          update: (subs, realm) => {
            subs.add(
              realm.objects(userSchema.name)
            );
            subs.add(
              realm.objects(userSchoolSchema.name)
            );
            subs.add(
              realm.objects(schoolActorSchema.name)
            );
            subs.add(
              realm.objects(schoolSchema.name)
            );
            subs.add(
              realm.objects(schoolYearSchema.name)
            );
            subs.add(
              realm.objects(schoolYearPeriodSchema.name)
            );
            subs.add(
              realm.objects(schoolYearDeadlineSchema.name)
            );
            subs.add(
              realm.objects(classroomSchema.name)
            );
            subs.add(
              realm.objects(classroomTeacherSchema.name)
            );
            subs.add(
              realm.objects(classroomMatterSchema.name)
            );
          },
          rerunOnOpen: true,
        },
      }
    });
    // await connexionMongoDBString();
    return realm

  } catch (error) {
    console.log('openRealm error: ', error);
    throw error;
  }
}

function closeRealm() {
  if (realm && !realm.isClosed) {
    console.info('Closing the realm...');
    realm.close();
    console.info('Realm closed.');
  }
  realm = null;
}

function modelChange(dogs, changes) {
  console.log(`changes: ${changes.documentKey}`);
  console.log(`dogs: ${dogs[0]}`);
  // Handle deleted Dog objects
  changes.deletions.forEach((index) => {
    // You cannot directly access deleted objects,
    // but you can update a UI list, etc. based on the index.
    console.log(`delete: ${dogs}}`);
  });
  // Handle newly added Dog objects
  changes.insertions.forEach((index) => {
    const insertedDog = dogs[index];
    console.log(`add: ${insertedDog.name}!`);
  });
  // Handle Dog objects that were modified
  changes.modifications.forEach((index) => {
    const modifiedDog = dogs[index];
    console.log(`edit: ${modifiedDog.name}`);
  });
}

async function logIn(email, password) {

  if (currentUser) {
    return currentUser;
  }

  try {
    // The credentials here can be substituted using a JWT or another preferred method.
    console.info('Logging in...');
    currentUser = await app.logIn(Realm.Credentials.emailPassword(email, password));
    // currentUser = await Realm.Credentials.anonymous();
    originalAccessToken = currentUser.accessToken;
    console.info('Logged in.');
    currentUser.addListener(handleUserEventChange);
    return true;
  } catch (err) {
    console.error(`Error logging in: ${err.message}`);
    return false;
  }
}

async function register(email, password) {
  // For this simplified example, the app is configured via the Atlas App Services UI
  // to automatically confirm users' emails.
  try {
    console.info('Registering...');
    const registerRes = await app.emailPasswordAuth.registerUser({ email, password });
    console.info('Registered.');
    console.log("registerRes", registerRes)
    return true;
  }
  catch (err) {
    if (err.message.includes('name already in use')) {
      console.info('Already registered.');
      return true;
    }
    console.error(`Error registering: ${err.message}`);
    return false;
  }
};

async function confirmEmail(token, tokenId) {
  try {
    console.info('Confirming email...');
    await app.emailPasswordAuth.confirmUser({ token, tokenId });
    console.info('Confirmed.');
    return true;
  }
  catch (err) {
    console.error(`Error confirming email: ${err.message}`);
    return false;
  }
};

function handleUserEventChange() {
  console.log('handleUserEventChange...');
  if (currentUser) {
    if (originalAccessToken !== currentUser.accessToken) {
      console.info("Refreshed access token.");
      originalAccessToken = currentUser.accessToken;
    }
    console.log(`User state changed: ${currentUser.state}`)

    switch (currentUser.state) {
      // case UserState.Active:       // Bug to be fixed: `UserState` is undefined.
      case 'LoggedIn':                // Bug to be fixed: Actual value is 'LoggedIn' but type is documented as 'active'
        console.info(`User (id: ${currentUser.id}) has been authenticated.`);
        break;
      // case UserState.LoggedOut:
      case 'LoggedOut':               // Bug to be fixed: Actual value is 'LoggedOut' but type is documented as 'logged-out'
        console.info(`User (id: ${currentUser.id}) has been logged out.`);
        resetUser();
        break;
      // case UserState.Removed:
      case 'Removed':                 // Bug to be fixed: Actual value is 'Removed' but type is documented as 'removed'
        console.info(`User (id: ${currentUser.id}) has been removed from the app.`);
        resetUser();
        break;
      default:
        // Should not be reachable.
        break;
    }
  }
}

function resetUser() {
  currentUser?.removeAllListeners();
  currentUser = null;
  originalAccessToken = null;
}

const connexionMongoDBString = async () => {
  const connectionString = 'mongodb://louguefranck.20@gmail.com:123456@eu-west-2.aws.realm.mongodb.com:27020/?authMechanism=PLAIN&authSource=%24external&ssl=true&appName=application-0-rijfk:mongodb-atlas:local-userpass';

  // Connect to the MongoDB cluster
  const client = app.getServiceClient(Realm.App.Sync);

  client.callFunction('openMongoDBRealm', 'mongodb+srv://' + connectionString);
}

module.exports = {
  openRealm,
  closeRealm,
  getRealm,
  modelChange,
  logIn,
  register,
  confirmEmail,
  connexionMongoDBString
}