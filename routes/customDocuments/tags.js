const express = require("express");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const { Tag } = require("../../models/customDocuments/tags");
const { Document } = require("../../models/documents");
const router = express.Router();

//-----------------------Get all tags-------------------------------
router.get("/", async (req, res) => {
	const tags = await Tag.find();
	if (!tags && tags.length === 0) return res.status(404).send("No taGS FOUND");

	res.send(tags);
});

//------------------------Get tags created byt the logged in user--------------------

router.get("/createdBy/:id", async (req, res) => {
	const tags = await Tag.find({ createdBy: req.params.id });

	if (!tags && tags.length === 0)
		return res.status(404).send("No tags were created tby this uer");

	res.send(tags);
});

//---------------------Get tags for a documentId-------------------------------------
router.get("/:id", async (req, res) => {
	const tags = await Tag.find({ documentId: req.params.id });
	if (!tags && tags.length === 0)
		return res.status(404).send("No tags were created tby this uer");

	res.send(tags);
});

//---------------------------Create a new tag-------------------------------------
router.post("/", async (req, res) => {
	const tag = new Tag({
		tag: req.body.tag,
		createdBy: req.body.createdBy,
		documentId: req.body.documentId,
		date: Date.now(),
	});

	const document = await Document.findById(req.body.documentId);
	document.tags.push(tag);
	await document.save();

	await tag.save();
	res.send(tag);
});

//-----------------------------Delete Tag-------------------------------------------
router.delete("/:id", async (req, res) => {
	const tag = await Tag.findByIdAndDelete(req.params.id);
	if (!tag) return res.status(404).send("tag not found for deleting");
	

	res.send(tag);
});

module.exports = router;
