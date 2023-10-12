const express = require("express");
const cors = require("cors");
const authUser = require("./modules/auth/authUserRouter");
const user = require("./modules/user/userRouter");
const emailRoute = require("./routes/mails/mail.route");
const schoolRoute = require("./modules/school/schoolRouter");
const directoryRoute = require("./routes/files/directory.route");
const schoolActorRoute = require("./modules/schoolActor/schoolActorRouter");
const userSchoolRoute = require("./modules/userSchool/userSchoolRouter");
const schoolYearRoute = require("./modules/schoolYear/schoolYearRouter");
const SchoolYearPeriod = require("./modules/schoolYearPeriod/schoolYearPeriodRouter");
const SchoolYearDeadline = require("./modules/deadline/schoolYearDeadlineRouter");
// const classroumRoute = require("./routes/classroum/classroum.route");
const main = require("./main");
const { realmQuery } = require("./services/realmQuery");
const { userSchoolSchema, userSchema } = require("./modules/user/model/userModel");
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
app.use(`${ENPOINT}${ENPOINTSCHOOL}`, schoolRoute);
app.use(`${ENPOINT}${ENPOINT_DIRECTORY}`, directoryRoute);
app.use(`${ENPOINT}/school-actor/`, schoolActorRoute);
app.use(`${ENPOINT}/user-school/`, userSchoolRoute);
app.use(`${ENPOINT}/school-year/`, schoolYearRoute);
app.use(`${ENPOINT}/school-year-period/`, SchoolYearPeriod);
app.use(`${ENPOINT}/school-year-deadline/`, SchoolYearDeadline);
// app.use(`${ENPOINT}${ENPOINT_CLASS}`, classroumRoute);

app.listen(PORT, async () => {
  // await main();
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app
