const Joi = require("joi");
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	departmentCode: {
		type: String,
		min:4,
		max:4,
		required: true,
	},
});

const Department = mongoose.model("Department", departmentSchema);

function validateDepartments(department) {
	const schema = Joi.object({
		name: Joi.string().required(),
		departmentCode: Joi.string().required(),
	});
	return schema.validate(department);
}

module.exports.validateDepartments = validateDepartments;
module.exports.Department = Department;
module.exports.departmentSchema = departmentSchema;
