const express = require("express");
const {
	validateDocuments,
	documentSchema,
	Document,
} = require("../models/documents");
const { Department } = require("../models/departments");
const router = express.Router();
const auth = require("../middlewares/auth");
const { date } = require("joi");
const { DocTypesField } = require("../models/docTypesFields");
const { DocType } = require("../models/doctypes");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.use(express.json());

router.get("/", async (req, res) => {
	const documents = await Document.find();

	if (documents.length === 0) return res.status(400).send("No document found");
	res.send(documents);
});

router.get("/:id", async (req, res) => {
	const document = await Document.findById(req.params.id);
	if (!document) return res.status(404).send("invaid id");
	res.send(document);
});

router.post("/", auth,upload.single("image"), async (req, res) => {
	// let indexingInfoArr = req.body.indexingInfo.map((iInfo, index) => {
	// 	let demo = {};
	// 	demo[iInfo] = req.body.fieldInput[index];
	// 	return demo;
	// });

	// const doctypeField = await DocTypesField.findById(req.body.indexingInfo[0]);

	// //indexingInfoObj[`${req.body.indexingInfo}`] = req.body.fieldInput[0];

	// const doctype = await DocType.findById(doctypeField.docType);
	// const department = await Department.findOne({ name: doctype.department });
	// const departmentcode = department.departmentCode;
	const departmentcode = req.body.depcode;

	const document = new Document({
		name: req.body.name,
		path: req.body.path,
		//indexingInfo: indexingInfoArr,
		indexingInfo: req.body.indexingInfo,
		dcn: generateDCN(departmentcode),
		date: Date.now(),
	});
	function getJulianDate() {
		// convert a Gregorian Date to a Julian number.

		let now = new Date();
		let start = new Date(now.getFullYear(), 0, 0);
		let diff =
			now -
			start +
			(start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
		let oneDay = 1000 * 60 * 60 * 24;
		let day = Math.floor(diff / oneDay);
		if (day.length === 1) {
			return "00" + day;
		} else if (day.length === 2) {
			return "0" + day;
		} else {
			return day;
		}
	}
	function generateDCN(depCode) {
		const d = new Date();
		const yyyy = d.getFullYear() + "";
		const yy = yyyy.substring(2);
		const dddyy = getJulianDate() + "" + yy;
		return depCode + dddyy + Math.random().toString(36).substring(2, 6);
	}

	const { error } = validateDocuments(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	await document.save();
	res.send(document);
});
router.delete("/:id", auth, async (req, res) => {
	const document = await Document.findById(req.params.id);
	if (!document) return res.status(404).send("invalid id");

	await document.delete();
	await document.save();
	res.send(document, req.file);
});

module.exports = router;
