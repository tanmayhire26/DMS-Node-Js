const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
	otp: String,
	userEmail: String,
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports.Otp = Otp;
