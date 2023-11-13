const express = require("express");
const cors = require("cors");
const {MongoClient} = require('mongodb');
const authUser = require("./modules/auth/authUserRouter");
const user = require("./modules/user/userRouter");
const emailRoute = require("./routes/mails/mail.route");
const schoolRoute = require("./modules/school/schoolRouter");
const directoryRoute = require("./routes/files/directory.route");
const schoolActorRoute = require("./modules/schoolActor/schoolActorRouter");
const userSchoolRoute = require("./modules/userSchool/userSchoolRouter");
const schoolYearRoute = require("./modules/schoolYear/schoolYearRouter");
const SchoolYearPeriodRoute = require("./modules/schoolYearPeriod/schoolYearPeriodRouter");
const SchoolYearDeadlineRoute = require("./modules/deadline/schoolYearDeadlineRouter");
const classroomRoute = require("./modules/classroom/classroomRouter");
const classroomTeacherRoute = require("./modules/classroomTeacher/classroomTeacherRouter");
const classroomMatterRoute = require("./modules/classroomMatter/classroomMatterRouter");
const pupilRoute = require("./modules/pupils/pupil.router");
const classroomPeriodRoute = require("./modules/pupilPeriod/classroomPeriod.router");
const noteRoute = require("./modules/note/note.router");

const main = require("./main");
require("dotenv").config({ path: "./config/.env" });
// require("./config/db");

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
app.use(`${ENPOINT}/school-year-period/`, SchoolYearPeriodRoute);
app.use(`${ENPOINT}/school-year-deadline/`, SchoolYearDeadlineRoute);
app.use(`${ENPOINT}/classroom`, classroomRoute);
app.use(`${ENPOINT}/classroom-teacher`, classroomTeacherRoute);
app.use(`${ENPOINT}/classroom-matter`, classroomMatterRoute);
app.use(`${ENPOINT}/classroom-pupil`, pupilRoute);
app.use(`${ENPOINT}/pupil-period`, classroomPeriodRoute);
app.use(`${ENPOINT}/pupil-note`, noteRoute);

app.listen(PORT, async () => {
  await main();
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app
