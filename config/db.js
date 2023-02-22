const mongoose = require('mongoose');
let conn
mongoose
	.connect(
`mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASWORD}@cluster0.fetcq4j.mongodb.net/EducDB`,
		{ useNewUrlParser: true, useUnifiedTopology: true },
	)
	.then((res) => {
		console.log('connected to mongoDB')
		conn = res.connection
	} )
	.catch(err => console.log('failed to connected mongoDB : ', err));
// 	const conn = mongoose.connection;
// 	conn.on("error", () => console.error.bind(console, "connection error"));

//   conn.once("open", () => console.info("Connection to Database is successful"));

// module.exports = conn