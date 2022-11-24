//npm packages import
const express = require("express");
const app = express();

//routes import
// require("./startup/prod")(app);

const m = require("./startup/prod");

const users = require("./routes/users");
const docTypes = require("./routes/docTypes");
const fields = require("./routes/fields");
const departments = require("./routes/departments");
const docTypesFields = require("./routes/docTypesFields");
const documents = require("./routes/documents");
const logins = require("./routes/logins");
const notify = require("./routes/notify");

const comments = require("./routes/customDocuments/comments");
const tags = require("./routes/customDocuments/tags");
const tagNames = require("./routes/customDocuments/tagNames");
const uploadImages = require("./routes/uploadImage");
const indexer = require("./routes/indexer");
const cors = require("cors");
//db connection
require("./db/conn");
const { createAdmin } = require("./createAdmin");

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
app.use("/api/notify", notify);
app.use("/api/uploadImages", uploadImages);
app.use("/api/comments", comments);
app.use("/api/tags", tags);
app.use("/api/tagNames", tagNames);
app.use("/api/indexer", indexer);
m(app);
createAdmin();

app.get("/", async (req, res) => {
	res.write(`welcome to the "docly" portal ! \n`);
	res.write("We help you store,manage and retrieve documents efficiently");
	res.send();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Server is runnig on Port ${port}`);
});
