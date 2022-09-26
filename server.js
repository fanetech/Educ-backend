const express = require('express');
const authUser = require("./routes/auth/auth.user")
const bodyParser = require('body-parser')

require('dotenv').config({ path: './config/.env' });
require('./config/db');

const app = express();
const PORT = process.env.PORT ?? 5000;
const ENPOINT = process.env.ENPOINT
const ENPOINTAUTH = process.env.ENPOINTAUTH


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`${ENPOINT}${ENPOINTAUTH}/user`, authUser)


app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
	console.log(`between ${PORT}${ENPOINT}`);
});
