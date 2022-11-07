const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const config = require("config");
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	userName: String,
	documentNo: String,
	description: String,
	isActive: {
		type: Boolean,
		default: true,
	},
	createdAt: Date,
	resolvedAt: Date,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports.Notification = Notification;
