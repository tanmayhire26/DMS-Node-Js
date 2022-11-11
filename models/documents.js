const { object } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
	indexingInfo: {
		type: Object,
		required: true,
	},
	dcn: {
		type: String,
		minLength: 13,
		maxLength: 20,

		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	doctype: {
		type: String,
		required: true,
	},
	department: {
		type: String,
		required: true,
	},
	sensitive: {
		type: Boolean,
		default: false,
	},
	tags: Array,
});

const Document = mongoose.model("Document", documentSchema);

function validateDocuments(document) {
	const schema = Joi.object({
		name: Joi.string().required(),
		path: Joi.string().required(),
		indexingInfo: Joi.object().required(),
		dcn: Joi.string().min(13).max(20),
		date: Joi.date(),
		//fieldInput:Joi.array(),
		depcode: Joi.string().required(),
		doctype: Joi.string().required(),
		department: Joi.string().required(),
		sensitive: Joi.boolean(),
		tags: Joi.array(),
	});
	return schema.validate(document);
}

module.exports.validateDocuments = validateDocuments;
module.exports.Document = Document;
module.exports.documentSchema = documentSchema;
