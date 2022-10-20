const mongoose = require("mongoose");
const config = require("config");
mongoose
	.connect(config.get("db"))
	.then(() => console.log("DB connection successful"))
	.catch((err) => console.log("DB connection failed"));
