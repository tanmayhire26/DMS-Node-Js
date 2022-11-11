const mongoose = require("mongoose");

const tagNameSchema = new mongoose.Schema({
	name: String,
	createdBy: mongoose.Types.ObjectId,
});

const TagName = mongoose.model("TagName", tagNameSchema);

module.exports.TagName = TagName;
