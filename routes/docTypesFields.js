const express = require("express");
const auth = require("../middlewares/auth");
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
		//fieldObj:await Field.find({"name.name":req.body.field})
		isRequired: req.body.isRequired,
	});
	await docTypesField.save();
	res.send(docTypesField);
});

router.post("/:id", auth, async (req, res) => {
	const { error } = validateDocTypesFields(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const docTypesField = await DocTypesField.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				docType: req.body.docType,
				field: req.body.field,
				isRequired: req.body.isRequired,
			},
		},
		{ new: true }
	);
	if (!docTypesField)
		return res.status(404).send("doctypefield with goven id was not found");

	res.status(200).send(docTypesField);
});
router.delete("/:id", async (req, res) => {
	const docTypesField = await DocTypesField.findByIdAndDelete(req.params.id);
	if (!docTypesField) return res.status(404).send("invalid id");

	res.send(docTypesField);
});

module.exports = router;
