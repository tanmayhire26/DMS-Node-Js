const express = require("express"),
	multer = require("multer"),
	mongoose = require("mongoose");
// const { v4: uuidv4 } = require('uuid');
// const { v1: uuidv1 } = require('uuid');
router = express.Router();
const DIR = "/Upload/Images";
const storage = multer.diskStorage({
	destination:
		"D:/Mudik_Training/DMS Project/BackEnd/Document-management/" + DIR,
	// (req, file, cb) => {
	// 	cb(null, DIR);
	// },
	filename: (req, file, cb) => {
		const originalname = file.originalname;
		cb(null, originalname);
	},
});
var upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
		}
	},
});
// User model

router.post("/", upload.single("profileImg"), (req, res, next) => {
	console.log(req.file);
	// res.send("uploaded");
});
router.get("/", (req, res, next) => {
	User.find().then((data) => {
		res.status(200).json({
			message: "User list retrieved successfully!",
			users: data,
		});
	});
});
module.exports = router;
