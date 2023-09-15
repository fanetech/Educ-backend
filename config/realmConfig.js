const Realm = require('realm');
// Realm.flags.THROW_ON_GLOBAL_REALM = false;
const { userSchema, user_schoolsSchema, test } = require('../modules/user/model/userModel');
const { getAtlasApp } = require('../atlasAppService/getAtlasApp');
const { SYNC_STORE_ID } = require('../atlasAppService/config');

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

      schema: [userSchema, user_schoolsSchema, test],
      // schemaVersion: 1,
      sync: {
        user: app.currentUser,
        flexible: true,
        newRealmFileBehavior: behaviorConfiguration,
        existingRealmFileBehavior: behaviorConfiguration,
        initialSubscriptions: {
          update: (subs, realm) => {
            subs.add(
              realm.objects(userSchema.name),
              { name: 'storeA' },
            );
            // subs.add(
            //   realm.objects(user_schoolsSchema.name),
            // )
          },
          rerunOnOpen: true,
        },
      }
    });
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


module.exports = {
  openRealm,
  closeRealm,
  getRealm,
  modelChange,
  logIn,
  register,
  confirmEmail
}