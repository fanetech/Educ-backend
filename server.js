const express = require("express");
const cors = require("cors");
const authUser = require("./modules/auth/authUserRouter");
const user = require("./modules/user/userRouter");
const emailRoute = require("./routes/mails/mail.route");
// const schoolRoute = require("./modules/school/schoolRouter");
const directoryRoute = require("./routes/files/directory.route");
// const classroumRoute = require("./routes/classroum/classroum.route");
const main = require("./main");
const { realmQuery } = require("./services/realmQuery");
const { user_schoolsSchema, userSchema } = require("./modules/user/model/userModel");
const { getRealm } = require("./config/realmConfig");
const { on } = require("nodemon");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");

// Connection DB
// connectDB()

const app = express();
const PORT = process.env.PORT ?? 5000;
const ENPOINT = process.env.ENPOINT;
const ENPOINTAUTH = process.env.ENPOINTAUTH;
const ENPOINTMAIL = process.env.ENPOINTMAIL;
const ENPOINTSCHOOL = process.env.ENPOINTSCHOOL;
const ENPOINT_DIRECTORY = process.env.ENPOINT_DIRECTORY;
const ENPOINT_CLASS = process.env.ENPOINT_CLASS;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders:
      "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization",
  })
);

app.use(`${ENPOINT}${ENPOINTAUTH}/user`, authUser);
app.use(`${ENPOINT}/user`, user);
app.use(`${ENPOINT}${ENPOINTMAIL}`, emailRoute);
// app.use(`${ENPOINT}${ENPOINTSCHOOL}`, schoolRoute);
app.use(`${ENPOINT}${ENPOINT_DIRECTORY}`, directoryRoute);
// app.use(`${ENPOINT}${ENPOINT_CLASS}`, classroumRoute);

app.get("/", async (req, res) => {
  const response = await realmQuery.getAll(user_schoolsSchema.name);
  res.send(response);
});
app.post("/", async (req, res) => {
  const realm = getRealm();
  const oneUser = await realmQuery.getOne(userSchema.name, req.body.id);
  // const response = await realmQuery.add(user_schoolsSchema.name, req.body);
  realm.write(() => {
   const userSchool = realm.create(user_schoolsSchema.name, {
      role: req.body.role,
    //  schoolId: req.body.schoolId,
     userId: oneUser._id,
    });
    oneUser.schools.push(userSchool._id)
  });
  res.send(oneUser);
});

app.listen(PORT, async () => {
  await main();
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app
