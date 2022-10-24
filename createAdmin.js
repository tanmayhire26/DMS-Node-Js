const { User } = require("./models/users");
const bcrypt = require("bcrypt");
async function createAdmin() {
	const admin = new User({
		firstName: "Tanmay",
		lastName: "Hire",
		email: "tanmay.hire123@gmail.com",
		userName: "admin",
		password: await bcrypt.hash("12345678", 10),
		phone: "1234567890",
		departments: ["All"],
		role: "Admin",
		//lastLoggedIn: req.body.lastLoggedIn,

		updatedBy: "",
		updatedAt: Date.now(),
	});

	admin.updatedBy = admin._id;
	const user = await User.find({ userName: "admin" });
	if (!user) return await admin.save();
}

module.exports.createAdmin = createAdmin;
