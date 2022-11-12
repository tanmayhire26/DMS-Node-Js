const express = require("express");
const { Indexer } = require("../models/indexer");
const router = express.Router();

//----------------------------------MULTER--------------------------------------------
const multer = require("multer");
// const storage = multer.diskStorage({
// 	destination: "indexerImages/",
// 	filename: function (req, file, cb) {
// 		cb(null, file.originalname);
// 	},
// });
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
//----------------------------------------------------------------------------------------

router.get("/", async (req, res) => {
	const indexers = await Indexer.find();
	if (!indexers) return res.status(404).send("Indexers not found");
	res.status(200).send(indexers);
});

//----------------------------POST_INDEXER-----------------------------------------------
router.post("/", upload.single("image"), async (req, res) => {
	// if (!req.file) {
	// 	res.send("no files found");
	// } else {
	// 	res.status(200).send("Upload succesful");
	// }

	console.log(req.file);

	const indexer = new Indexer({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		profileImage: {
			filename: req.file.originalname,
			mimetype: req.file.mimetype,
			data: req.file.buffer,
		},
	});
	await indexer.save();
	res.send(indexer);
});

module.exports = router;
