const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const { User, userSchema, validateUsers } = require("../models/users");
router.use(express.json());

router.get("/", async (req, res) => {
	const users = await User.find();
	if (!users) return res.status(404).send("No user registered yet!");
	res.send(users);
});
router.get("/:id", async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(500).send("user with this id doesn't exist");
	res.send(user);
});
router.post("/", async (req, res) => {
	const { error } = validateUsers(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	let user = new User({
		firstName: req.body.userName,
		lastName: req.body.lastName,
		email: req.body.email,
		userName: req.body.userName,
		password: req.body.password,
		phone: req.body.phone,
		departments: req.body.departments,
		role:req.body.role,
		//role: req.body.role,
		// lastLoggedIn: req.body.lastLoggedIn,

		//updatedBy: req.body.updatedBy,
		updatedAt: Date.now(),
	});

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(req.body.password, salt);
	await user.save();
	res.send(user);
});
module.exports = router;
