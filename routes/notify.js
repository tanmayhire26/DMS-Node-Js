const express = require("express");
const router = express.Router();
const { Notification } = require("../models/notify");

router.use(express.json());

router.get("/", async (req, res) => {
	const notifications = await Notification.find();
	res.send(notifications);
});

router.post("/", async (req, res) => {
	const notification = new Notification({
		userName: req.body.userName,
		documentNo: req.body.documentNo,
		description: req.body.description,
		isActive: true,
		createdAt: Date.now(),
	});

	await notification.save();
	res.send(notification);
});

router.patch("/:id", async (req, res) => {
	const notification = await Notification.findById(req.params.id);
	if (!notification) return res.status(404).send("not found");

	notification.isActive = false;
	notification.resolvedAt = Date.now();
	await notification.save();
	res.send(notification);
});
module.exports = router;
