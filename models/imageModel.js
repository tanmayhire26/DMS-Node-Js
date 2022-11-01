const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
	filename: { type: String },
	data: { type: Buffer },
	mimetype: { type: String },
});

const Image = mongoose.model("Images", imageSchema);

module.exports.Image = Image;
module.exports.imageSchema = imageSchema;
