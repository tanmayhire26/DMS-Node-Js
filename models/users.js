const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	profileImage: { originalname: String, mimetype: String, data: Buffer },
	email: {
		type: String,

		required: true,
	},
	verified: { type: Boolean, default: false },
	phone: {
		type: String,
		minLength: 10,
		maxLength: 10,
		required: true,
	},
	userName: {
		type: String,
		unique: true,
		required: true,
	},

	password: {
		minLength: 8,
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	clearance: {
		type: Boolean,
		default: false,
	},

	//object id array here for departments
	//departments: mongoose.Types.ObjectId,
	departments: [String],

	lastLoggedIn: {
		type: Date,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	updatedBy: {
		type: mongoose.Types.ObjectId,
		default: null,
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			role: this.role,
			firstName: this.firstName,
			email: this.email,
			userName: this.userName,
			isActive: this.isActive,
			departments: this.departments,
			clearance: this.clearance,
			verified: this.verified,
		},
		config.get("jwtPrivateKey")
	);
	return token;
};

const User = mongoose.model("User", userSchema);

function validateUsers(user) {
	const schema = Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().required().email(),
		phone: Joi.string().required().min(10).max(10),
		userName: Joi.string().required(),
		password: Joi.string().required().min(8),
		role: Joi.string(),
		departments: Joi.array().required(), //objct id here
		lastLoggedIn: Joi.date(),
		isActive: Joi.boolean(),
		updatedBy: Joi.string(),
		updatedAt: Joi.date(),
		clearance: Joi.boolean(),
		verified: Joi.boolean(),
	});
	return schema.validate(user);
}

module.exports.validateUsers = validateUsers;
module.exports.User = User;
module.exports.userSchema = userSchema;
