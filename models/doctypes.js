const mongoose = require("mongoose");
const Joi = require("joi");

const docTypeSchema = new mongoose.Schema({
	docTypeCode: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	department: {
		type: String,
		required: true,
	},
});

const DocType = mongoose.model("DocType", docTypeSchema);

function validateDocTypes(docType) {
	const schema = Joi.object({
		docTypeCode: Joi.string().required(),
		name: Joi.string().required(),
		department: Joi.string().required(),
	});
	return schema.validate(docType);
}

module.exports.docTypeSchema = docTypeSchema;
module.exports.DocType = DocType;
module.exports.validateDocTypes = validateDocTypes;
