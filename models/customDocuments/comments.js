const Joi = require("joi");
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	comment: String,
	userId: mongoose.Types.ObjectId,
	userName: String,
	documentId: mongoose.Types.ObjectId,
	date: Date,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports.Comment = Comment;
