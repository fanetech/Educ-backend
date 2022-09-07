const mongoose = require('mongoose');
mongoose
	.connect(
		`mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASWORD}@cluster0.nok7p.mongodb.net/mern-project`,
		{ useNewUrlParser: true, useUnifiedTopology: true },
	)
	.then(() => console.log('connected to mongoDB'))
	.catch(err => console.log('failed to connected mongoDB : ', err));
