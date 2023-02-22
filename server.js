const express = require("express");
const cors = require("cors");
const authUser = require("./routes/auth/auth.user");
const user = require("./routes/user/user.route");
const emailRoute = require("./routes/mails/mail.route");
const schoolRoute = require("./routes/school/school.route");
const directoryRoute = require("./routes/files/directory.route");
const classroumRoute = require("./routes/classroum/classroum.route");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");

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
app.use(`${ENPOINT}${ENPOINT_CLASS}`, classroumRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`between ${PORT}${ENPOINT}${ENPOINTSCHOOL}`);
});
