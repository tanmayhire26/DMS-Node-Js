const mongoose = require("mongoose");
const Joi = require("joi");

const docTypesFieldSchema = new mongoose.Schema({
	docType: mongoose.Types.ObjectId,
	field: mongoose.Types.ObjectId,
	isRequired: {
		type: Boolean,
		required: true,
	},
});

const DocTypesField = mongoose.model("DocTypesField", docTypesFieldSchema);

function validateDocTypesFields(docTypesField) {
	const schema = Joi.object({
		docType: Joi.string().required(),
		field: Joi.string().required(),
		isRequired: Joi.boolean().required(),
        
	});
	return schema.validate(docTypesField);
}

module.exports.validateDocTypesFields = validateDocTypesFields;
module.exports.DocTypesField = DocTypesField;
module.exports.docTypesFieldSchema = docTypesFieldSchema;
