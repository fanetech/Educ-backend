const mongoose = require('mongoose');
require("dotenv").config({ path: "./config/.env" });
// let conn
const url = "mongodb://0.0.0.0:27017"
// const url = `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASWORD}@cluster0.fetcq4j.mongodb.net`
mongoose
	.connect(
`${url}/EducDB`,
		{ useNewUrlParser: true, useUnifiedTopology: true },
	)
	.then((res) => {
		console.log('connected to mongoDB')
		// conn = res.connection
	} )
	.catch(err => console.log('failed to connected mongoDB : ', err));
// 	 conn = mongoose.connection;
// 	conn.on("error", () => console.error.bind(console, "connection error"));

//   conn.once("open", () => console.info("Connection to Database is successful"));

// module.exports = conn

// const connectDB = async () => {
// 	try {
// 		const url = "mongodb://localhost:27017"
// 		// const url = `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASWORD}@cluster0.fetcq4j.mongodb.net`
// 		mongoose.set("strictQuery", false);
// 		mongoose.connect(`${url}/EducDB`, () => {
// 			console.log('Connected to mongoDB')
// 		})
		
// 	} catch (error) {
// 		console.log(error)
// 		process.exit()
// 	}
// }

// module.exports = connectDB;