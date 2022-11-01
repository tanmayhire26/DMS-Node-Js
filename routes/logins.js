const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

//const { sendMail } = require("../emailBuilder");
const { User, userSchema } = require("../models/users");
router.post("/", async (req, res) => {
	const { error } = validateLogins(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ userName: req.body.userName });
	if (!user) return res.status(400).send("invalid username or password");

	const isValid = await bcrypt.compare(req.body.password, user.password);
	if (!isValid) return res.status(400).send("invalid username or password");

	// if (user.isActive === false) return res.send(400).send("user is not active");
	//res.send(isValid);
	// const token = jwt.sign(
	// 	{ _id: user._id, isAdmin: user.isAdmin },
	// 	config.get("jwtPrivateKey")
	// );
	//const token = userSchema.methods.generateAuthToken();
	const token = await user.generateAuthToken();

	console.log(token);
	user.lastLoggedIn = Date.now();
	// user.isActive = true;
	await user.save();
	res.send(token);
});

function validateLogins(logins) {
	const schema = Joi.object({
		userName: Joi.string().required().min(5).max(255),
		password: Joi.string().required().min(8).max(1024),
	});
	return schema.validate(logins);
}

module.exports = router;
