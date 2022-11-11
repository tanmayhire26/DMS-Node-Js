const express = require("express");
const { TagName } = require("../../models/customDocuments/tagNames");
const router = express.Router();

router.get("/", async (req, res) => {
	const tagNames = await TagName.find();
	if (!tagNames) return res.status(404).send("No tag names available");

	res.send(tagNames);
});

router.post("/", async (req, res) => {
	const tagName = new TagName({
		name: req.body.name,
		createdBy: req.body.createdBy,
	});
	await tagName.save();
	res.send(tagName);
});

module.exports = router;
