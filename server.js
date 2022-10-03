const express = require('express');
const authUser = require("./routes/auth/auth.user")
const emailRoute = require('./routes/mails/mail.route')
const schoolRoute = require('./routes/school/school.route')
require('dotenv').config({ path: './config/.env' });
require('./config/db');

const app = express();
const PORT = process.env.PORT ?? 5000;
const ENPOINT = process.env.ENPOINT
const ENPOINTAUTH = process.env.ENPOINTAUTH
const ENPOINTMAIL = process.env.ENPOINTMAIL
const ENPOINTSCHOOL = process.env.ENPOINTSCHOOL


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`${ENPOINT}${ENPOINTAUTH}/user`, authUser)
app.use(`${ENPOINT}${ENPOINTMAIL}`, emailRoute )
app.use(`${ENPOINT}${ENPOINTSCHOOL}`, schoolRoute )



app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	console.log(`between ${PORT}${ENPOINT}${ENPOINTSCHOOL}`);
});
