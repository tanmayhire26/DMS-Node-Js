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
const tanmay = require("../Upload/index");

const multer = require("multer");
// const imageStorage = multer.diskStorage({
// 	// Destination to store image
// 	destination: "Uploads",
// 	filename: (req, file, cb) => {
// 		cb(
// 			null,
// 			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
// 		);
// 	},
// });
// const imageUpload = multer({
// 	storage: imageStorage,
// 	limits: {
// 		fileSize: 1000000,
// 	},
// 	fileFilter(req, file, cb) {
// 		if (!file.originalname.match(/\.(png|jpg)$/)) {
// 			return cb(new Error("Please upload a Image"));
// 		}
// 		cb(undefined, true);
// 	},
// });

router.use(express.json());

router.get("/", async (req, res) => {
	const documents = await Document.find();

	if (documents.length === 0) return res.status(400).send("No document found");
	res.send(documents);
});

// router.post("/upload/", imageUpload.single("image"), async (req, res) => {
// 	try {
// 		// const file = {
// 		// 	data: req.file.buffer,
// 		// 	filename: req.file.originalname,
// 		// 	mimetype: req.file.mimetype,
// 		// };
// 		return res.send("image saved succesfully");
// 	} catch (error) {
// 		console.log(error);
// 	}
// });

router.post("/filteredForUser", async (req, res) => {
	let filteredDocumentsArr = [];
	const userDepartmentIdsArr = req.body.departments;
	let userDepartmentNamesArr = [];
	for (let i = 0; i < userDepartmentIdsArr.length; i++) {
		let department = await Department.findById(userDepartmentIdsArr[i]);
		let departmentName = department.name;
		userDepartmentNamesArr.push(departmentName);
	}

	if (userDepartmentNamesArr) {
		for (let j = 0; j < userDepartmentNamesArr.length; j++) {
			const documents = await Document.find({
				department: userDepartmentNamesArr[j],
			});
			if (documents.length !== 0) {
				documents.forEach((department) => {
					filteredDocumentsArr.push(department);
				});
			}
		}
	}

	//-----------------------FILTER------------------------------
	const departmentFilter = req.body.departmentFilter;
	const doctypeFilter = req.body.doctypeFilter;
	let furtherFilteredDocuments = [];
	let filteredByDepDocs = [];
	if (departmentFilter) {
		if (departmentFilter === "All") return res.send(filteredDocumentsArr);
		filteredByDepDocs = filteredDocumentsArr.filter(
			(fd) => fd.department === departmentFilter
		);
	} else {
		return res.send(filteredDocumentsArr);
	}
	if (doctypeFilter) {
		furtherFilteredDocuments = filteredByDepDocs.filter(
			(fd) => fd.doctype === doctypeFilter
		);
	} else {
		return res.send(filteredByDepDocs);
	}

	//-----------------------Search Query---------------------------------------------------------------------------------------------
	let searchQuery = req.body.searchQuery;
	let doctypefieldId = req.body.doctypefieldReq;
	let searchedFilteredDocuments = [];

	if (searchQuery) {
		let query = new RegExp(`^${searchQuery}`, "i");
		furtherFilteredDocuments.forEach((ffd) => {
			if (ffd.indexingInfo[`${doctypefieldId._id}`].match(query)) {
				searchedFilteredDocuments.push(ffd);
			}
		});
	} else {
		return res.send(furtherFilteredDocuments);
	}

	return res.send(searchedFilteredDocuments);
});

//--------------------------------------------------------------------------------------------------------------------------------

router.get("/:id", async (req, res) => {
	const document = await Document.findById(req.params.id);
	if (!document) return res.status(404).send("invaid id");
	res.send(document);
});

router.post("/", auth, async (req, res) => {
	const departmentcode = req.body.depcode;

	const document = new Document({
		name: req.body.name,
		path: req.body.path,
		//indexingInfo: indexingInfoArr,
		indexingInfo: req.body.indexingInfo,
		dcn: generateDCN(departmentcode),
		date: Date.now(),
		doctype: req.body.doctype,
		department: req.body.department,
	});

	const path = req.body.path;

	if (path) {
		tanmay("./Upload/images/" + path.slice(14));
	}
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
//----------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------generate cloudinary image URL for open document form of add doc-----------------------------------------------------------
router.post("/preview", async (req, res) => {
	const path = req.body.imageName;
	if (path) {
		tanmay("./Upload/images/" + path);
	}
	res.send();
});

//--------------------------------------------------------DELETE API------------------------------------------------------
router.delete("/:id", async (req, res) => {
	console.log("welcome here");
	const document = await Document.findByIdAndDelete(req.params.id);
	if (!document) return res.status(404).send("invalid id");

	res.send(document);
});

module.exports = router;
