const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { Field, fieldSchema, validateFields } = require("../models/fields");
router.use(express.json());

router.get("/", async (req, res) => {
	const fields = await Field.find();
	res.send(fields);
});

router.get("/:id", async (req, res) => {
	const field = await Field.findById(req.params.id);
	if (!field) return res.status(404).send("field with givenid not found");
});

router.post("/", auth, async (req, res) => {
	const { error } = validateFields(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const field = new Field({
		name: req.body.name,
	});

	await field.save();
	res.send(field);
});

router.put("/:id", auth, async (req, res) => {
	const { error } = validateFields(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const field = await Field.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				name: req.body.name,
			},
		},
		{ new: true }
	);

	if (!field) return res.status(404).send("Field not found");

	res.status(200).send(field);
});

router.delete("/:id", auth, async (req, res) => {
	const field = await Field.findByIdAndDelete(req.params.id);
	if (!field) return res.status(404).send("Field not found");

	res.status(200).send(field);
});

module.exports = router;
