const { openRealm, register, logIn } = require("./config/realmConfig");
const exampleEmail = 'louguefranck.20@gmail.com';
const examplePassword = '123456';

async function main() {
    // let success = await register(exampleEmail, examplePassword);
    // if (!success) {
    //   console.log('Register failed.');
    //   return;
    // }
  
    // success = await logIn(exampleEmail, examplePassword);
    // if (!success) {
    //   return;
    // }
  
    await openRealm();
  
  }

  module.exports = main;