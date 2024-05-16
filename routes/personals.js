const express = require("express");
const router = express.Router();
const multer = require("multer");

const { storage } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const personals = require("../controllers/personals")

const Personal = require("../models/personal");

const { isLoggedIn, isAuthor, validatePersonal } = require("../middleware");

router.route("/")
    .get(catchAsync(personals.index))
    .post(isLoggedIn, upload.array("image"), validatePersonal, catchAsync(personals.createPersonal))

router.get("/new", isLoggedIn, personals.renderNewForm);

router.route("/:id")
    .get(catchAsync(personals.showPersonal))
    .put(isLoggedIn, isAuthor, upload.array("image"), validatePersonal, catchAsync(personals.updatePersonal))
    .delete(isLoggedIn, isAuthor, catchAsync(personals.deletePersonal))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(personals.renderEditForm));


module.exports = router;
