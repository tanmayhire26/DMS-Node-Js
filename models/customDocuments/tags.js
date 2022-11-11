const Joi = require("joi");
const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
	tag: String,
	createdBy: mongoose.Types.ObjectId,
	documentId: mongoose.Types.ObjectId,
	date: Date,
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports.Tag = Tag;
