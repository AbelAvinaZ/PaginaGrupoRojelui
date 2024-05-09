const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const Personal = require("../models/personal");

const { isLoggedIn, isAuthor, validatePersonal } = require("../middleware");


router.get("/", catchAsync(async (req, res) => {
    const personals = await Personal.find({});
    res.render("personal/index", { personals })
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("personal/new");
});

router.post("/", isLoggedIn, validatePersonal, catchAsync(async (req, res) => {
    const personal = new Personal(req.body.personal);
    personal.author = req.user._id;
    await personal.save();
    req.flash("success", "Creaste de forma exitosa a un nuevo empleado!")
    res.redirect(`/personal/${personal._id}`)
}));

router.get("/:id", catchAsync(async (req, res) => {
    const personal = await Personal.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    console.log(personal);
    if (!personal) {
        req.flash("error", "No puedo encontrar lo que buscas!");
        return res.redirect("/personal");
    }
    res.render("personal/show", { personal });
}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const personal = await Personal.findById(id);
    if (!personal) {
        req.flash("error", "No puedo encontrar lo que buscas!");
        return res.redirect("/personal");
    }
    res.render("personal/edit", { personal });
}));

router.put("/:id", isLoggedIn, isAuthor, validatePersonal, catchAsync(async (req, res) => {
    const { id } = req.params;
    const personal = await Personal.findByIdAndUpdate(id, { ...req.body.personal });
    req.flash("success", "Modificaste la información del empleado!")
    res.redirect(`/personal/${personal._id}`)
}));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Personal.findByIdAndDelete(id);
    req.flash("success", "Eliminaste la información del empleado!")
    res.redirect("/personal");
}));

module.exports = router;
