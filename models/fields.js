const mongoose = require("mongoose");
const Joi = require("joi");

const { string } = require("joi");

const fieldSchema = new mongoose.Schema({
	name: {
		name: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		input: {
			type: String,
			required: true,
		},
	},
});

const Field = mongoose.model("Field", fieldSchema);

function validateFields(field) {
	const schema = Joi.object({
		name: {
			name: Joi.string().required(),
			label: Joi.string().required(),
			input: Joi.string().required(),
		},
	});
	return schema.validate(field);
}

module.exports.fieldSchema = fieldSchema;
module.exports.Field = Field;
module.exports.validateFields = validateFields;
