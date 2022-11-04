const express = require("express");
const router = express.Router();
const {
	DocType,
	docTypeSchema,
	validateDocTypes,
} = require("../models/doctypes");

//middleware
router.use(express.json());

router.get("/", async (req, res) => {
	const docTypes = await DocType.find();
	res.send(docTypes);
});

//------------------------------------------Get Filtered Doctypes API------------------------------------------------------------
router.post("/filtered", async (req, res) => {
	const nameSearchQuery = req.body.nameSearchQuery;
	let doctypes = await DocType.find();
	let query = "";
	if (nameSearchQuery) {
		query = new RegExp(`^${nameSearchQuery}`, "i");
		doctypes = await DocType.find({ name: query });
	}

	res.send(doctypes);
});

//-------------------------------------------------------------------------------------------------------------------------------
router.get("/:id", async (req, res) => {
	const docType = await DocType.findById(req.params.id);
	if (!docType)
		return res.status(404).send("doctype with the given id not found");

	res.send(docType);
});

router.post("/", async (req, res) => {
	const { error } = validateDocTypes(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const docType = new DocType({
		docTypeCode: req.body.docTypeCode,
		name: req.body.name,
		department: req.body.department, //object id here
	});
	await docType.save();
	res.send(docType);
});

router.put("/:id", async (req, res) => {
	const { error } = validateDocTypes(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	const doctype = await DocType.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				name: req.body.name,
				department: req.body.department,
				docTypeCode: req.body.docTypeCode,
			},
		},
		{ new: true }
	);
	res.status(200).send(doctype);
});

router.delete("/:id", async (req, res) => {
	const doctype = await DocType.findByIdAndDelete(req.params.id);
	if (!doctype)
		return res.status(404).send("doc type with the id was not found");
	res.status(200).send(doctype);
});

module.exports = router;
