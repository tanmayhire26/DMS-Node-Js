const express = require("express");
const { Comment } = require("../../models/customDocuments/comments");
const router = express.Router();

router.use(express.json());

//----------get comments by documentId---------------------------
router.get("/:id", async (req, res) => {
	const comments = await Comment.find({ documentId: req.params.id });
	if (!comments)
		return res.status(404).send("no comments found for this document");

	res.send(comments);
});

//------------Add comment-----------------

router.post("/", async (req, res) => {
	const comment = new Comment({
		comment: req.body.comment,
		userId: req.body.userId,
		userName: req.body.userName,
		documentId: req.body.documentId,
		date: Date.now(),
	});
	await comment.save();
	res.send(comment);
});

module.exports = router;
