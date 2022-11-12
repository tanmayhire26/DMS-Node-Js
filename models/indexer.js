const mongoose = require("mongoose");

const indexerSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,

	profileImage: {
		filename: { type: String },
		data: { type: Buffer },
		mimetype: { type: String },
	},
});

const Indexer = mongoose.model("Indexers", indexerSchema);

module.exports.Indexer = Indexer;
