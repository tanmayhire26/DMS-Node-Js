const express = require("express");
const {
	DocTypesField,
	validateDocTypesFields,
} = require("../models/docTypesFields");
const router = express.Router();

router.use(express.json());

router.get("/", async (req, res) => {
	const docTypesFields = await DocTypesField.find();
	res.send(docTypesFields);
});

router.get("/:id", async (req, res) => {
	const docTypesField = await DocTypesField.findById(req.params.id);
	if (!docTypesField) return res.status(404).send("invalid id");

	res.send(docTypesField);
});

router.post("/", async (req, res) => {
	const { error } = validateDocTypesFields(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const docTypesField = new DocTypesField({
		docType: req.body.docType,
		field: req.body.field,
		isRequired: req.body.isRequired,
	});
	await docTypesField.save();
	res.send(docTypesField);
});
router.delete("/:id", async (req, res) => {
	const docTypesField = await DocTypesField.findById(req.params.id);
	if (!docTypesField) return res.status(404).send("invalid id");

	await docTypesField.delete();
	await docTypesField.save();
	res.send(docTypesField);
});

module.exports = router;
