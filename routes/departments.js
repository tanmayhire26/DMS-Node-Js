const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
	validateDepartments,
	Department,
	departmentSchema,
} = require("../models/departments");

router.use(express.json());

router.get("/", async (req, res) => {
	const departments = await Department.find();
	res.send(departments);
});

//------------------------------------------GET Filtered Department----------------------------------------

router.post("/filtered", async (req, res) => {
	const searchQuery = req.body.searchQuery;
	let query = new RegExp(`^${searchQuery}`, "i");

	const departments = await Department.find({ name: query }).sort({ name: 1 });
	res.status(200).send(departments);
});
//-------------------------------------------------------------------------------------------------------------------
router.get("/:id", async (req, res) => {
	const department = await Department.findById(req.params.id);
	if (!department) return res.status(404).send("invalid id");
	res.send(department);
});

router.post("/", async (req, res) => {
	const { error } = validateDepartments(req.body);
	if (error) res.status(400).send(error.details[0].message);

	const department = new Department({
		name: req.body.name,
		departmentCode: req.body.departmentCode,
	});

	await department.save();
	res.send(department);
});

router.put("/:id", async (req, res) => {
	const { error } = validateDepartments(req.body);
	if (error) res.status(400).send(error.details[0].message);

	const department = await Department.findByIdAndUpdate(
		req.params.id,
		{
			$set: { name: req.body.name, departmentCode: req.body.departmentCode },
		},
		{ new: true }
	);

	if (!department)
		return res.status(404).send("The department with the id was not found");
	res.send(department);
});

router.delete("/:id", async (req, res) => {
	const department = await Department.findByIdAndDelete(req.params.id);
	if (!department) return res.status(404).send("Department not found");
	res.status(200).send(department);
});
module.exports = router;
