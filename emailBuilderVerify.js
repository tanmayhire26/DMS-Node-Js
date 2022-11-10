const nodemailer = require("nodemailer");
require("dotenv").config();

function sendVerifyMail(user, email, otpG) {
	console.log(user);

	transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "tanmayh@valueaddsofttech.com",
			pass: process.env.password,
		},
	});
	const mailConfigurations = {
		// It should be a string of sender email
		from: "tanmayh@valueaddsofttech.com",

		// Comma Separated list of mails
		to: email,

		// Subject of Email
		subject: "Verify email id - DMS",

		// This would be the text of email body
		html: `<h2>Hi! <b>${user[0].firstName}<b>!!!</h2><p> Your one time use verification code is <i>${otpG}</i></p> <img src='cid:unique@cid'> <br><br> Regards,<br>Admin,<br>DMS India`,
		attachments: [
			{
				filename: "loginImage.png",
				path: "loginImage.png",
				cid: "unique@cid",
			},
		],
	};
	transporter.sendMail(mailConfigurations, function (error, info) {
		if (error) throw Error(error);
		console.log("Email Sent Successfully");
		console.log(info);
	});
}

module.exports.sendVerifyMail = sendVerifyMail;
