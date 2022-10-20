//npm packages import
const express = require("express");
const app = express();

//routes import
const users = require("./routes/users");
const docTypes = require("./routes/docTypes");
const fields = require("./routes/fields");
const departments = require("./routes/departments");
const docTypesFields = require("./routes/docTypesFields");
const documents = require("./routes/documents");
const logins = require("./routes/logins");
const cors = require("cors");
//db connection
require("./db/conn");

//use middlewares
console.log("ok");
app.use(express.json());
app.use(cors());
app.use("/api/users", users);
app.use("/api/docTypes", docTypes);
app.use("/api/fields", fields);
app.use("/api/departments", departments);
app.use("/api/docTypesFields", docTypesFields);
app.use("/api/documents", documents);
app.use("/api/logins", logins);

app.get("/", async (req, res) => {
	res.write(`welcome to the "docly" portal ! \n`);
	res.write(
		"We help you generate, keep and share report cards of your students effectively."
	);
	res.send();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is runnig on Port ${port}`);
});
