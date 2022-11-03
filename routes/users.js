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

router.post("/filtered", async (req, res) => {
	const allUsers = await User.find();
	const role = req.body.role;
	const searchQuery = req.body.searchQuery;
	const departmentsArr = req.body.departmentsArr;
	let usersOfDepartments = [];
	//-------------trial of multiple options to filter from------

	// for (let i = 0; i < allUsers.length; i++) {
	// 	let tempDepobj = [];
	// 	for (let j = 0; j < allUsers[i].departments.length; j++) {
	// 		let tempDep = allUsers[i].departments;
	// 		let tempDepR = departmentsArr?.filter((d) => d === tempDep[j].name);
	// 		if (tempDepR.length !== 0) {
	// 			tempDepobj.push(tempDepR);
	// 		}
	// 	}
	// 	if (tempDepobj.length !== 0) {
	// 		usersOfDepartments.push(allUsers[i]);
	// 	}
	// }

	// if (departmentsArr.length !== 0) return res.send(usersOfDepartments);
	//---------------------------------------------------------------------------------
	let query = new RegExp(`^${searchQuery}`, "i");
	let users = [];

	if (role === "All") {
		users = await User.find({ userName: query }).sort({
			userName: 1,
		});
		return res.send(users);
	}
	users = await User.find({ role: role, userName: query }).sort({
		userName: 1,
	});
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
		role: req.body.role,
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

router.put("/:id", async (req, res) => {
	const { error } = validateUsers(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				firstName: req.body.userName,
				lastName: req.body.lastName,
				email: req.body.email,
				userName: req.body.userName,
				password: req.body.password,
				phone: req.body.phone,
				departments: req.body.departments,
				role: req.body.role,
				//role: req.body.role,
				// lastLoggedIn: req.body.lastLoggedIn,

				updatedBy: req.body.updatedBy,
				updatedAt: Date.now(),
			},
		},
		{ new: true }
	);
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(req.body.password, salt);
	await user.save();
	res.send(user);
});

router.patch("/:id", auth, async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user)
		return res.status(404).send("User with the given id was  not found");
	user.isActive =
		user.isActive === true ? (user.isActive = false) : (user.isActive = true);
	user.updatedAt = Date.now();
	user.updatedBy = "63523988acbce709805ae706";
	await user.save();
	res.send(user);
});
module.exports = router;
