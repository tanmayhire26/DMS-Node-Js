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
const tanmay = require("../Upload/index");
const { TagName } = require("../models/customDocuments/tagNames");
const { Tag } = require("../models/customDocuments/tags");
const multer = require("multer");
let currentUDs = []; //will store documents filtered according to the departments of the user logged in

//----------------------------------------------multer-------------------------------------------
const storage = multer.diskStorage({
	destination: "documentImages/",
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});
const upload = multer({ storage: storage });
//--------------------------------------------------------------------------------------------------
router.use(express.json());

router.get("/", async (req, res) => {
	const documents = await Document.find();

	if (documents.length === 0) return res.status(400).send("No document found");
	res.send(documents);
});

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

	currentUDs = filteredDocumentsArr;

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
			if (ffd.indexingInfo[`${doctypefieldId._id}`]?.match(query)) {
				searchedFilteredDocuments.push(ffd);
			}
		});
	} else {
		return res.send(furtherFilteredDocuments);
	}

	return res.send(searchedFilteredDocuments);
});

//-------------------------------------Get Documents filtered by custom Tags------------------------------------------

router.post("/filteredByTags", async (req, res) => {
	const filterTag = req.body.filterTag;
	const documents = currentUDs; //documents of departments of the logged in user
	let documentsArr = [];
	documents.forEach((d) => {
		let docTags = d.tags;
		let docwtag = docTags.find((dt) => dt.tag === filterTag.name);
		if (docwtag) {
			documentsArr.push(d);
		}
	});
	console.log(documentsArr);
	res.send(documentsArr);
});

//--------------------------------------------------------------------------------------------------------------------------------

router.get("/:id", async (req, res) => {
	const document = await Document.findById(req.params.id);
	if (!document) return res.status(404).send("invaid id");
	res.send(document);
});

//-----------------------------ADD Document and upload image using multer and to cloudinary-------------

router.post("/", upload.single("documentImage"), async (req, res) => {
	const departmentcode = req.body.depcode;

	const document = new Document({
		name: req.body.name,
		path: req.body.path,
		documentImage: { filename: req.file.filename, mimetype: req.file.mimetype },
		//indexingInfo: indexingInfoArr,
		indexingInfo: req.body.indexingInfo,
		dcn: generateDCN(departmentcode),
		date: Date.now(),
		doctype: req.body.doctype,
		department: req.body.department,
		sensitive: req.body.sensitive,
	});

	const path = req.file.filename;

	if (path) {
		tanmay("./documentImages/" + path);
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

//--------------------------------------------------------DELETE API------------------------------------------------------
router.delete("/:id", async (req, res) => {
	const document = await Document.findByIdAndDelete(req.params.id);
	if (!document) return res.status(404).send("invalid id");

	res.send(document);
});

//------------------------------------Update indexing info---------------------------------------

router.patch("/:id", async (req, res) => {
	const document = await Document.findById(req.params.id);
	if (!document) return res.status(404).send("not found");

	document.indexingInfo = req.body.indexingInfo;
	await document.save();
	res.status(200).send(document);
});

//-----------------------------Patch DocumentImage-----------------------------------------------------
router.patch(
	"/documentImage/:id",
	upload.single("documentImage"),
	async (req, res) => {
		const document = await Document.findById(req.body.documentId);

		if (!document) return res.status(404).send("document no found");
		document.documentImage.filename = req.file.filename;
		document.documentImage.mimetype = req.file.mimetype;
		document.documentImage.data = null;
		await document.save();
		res.send(document);
	}
);

module.exports = router;
