const express = require("express");
const router = express.Router();

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const Personal = require("../models/personal");

const { personalSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");


const validatePersonal = (req, res, next) => {
    const { error } = personalSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get("/", catchAsync(async (req, res) => {
    const personals = await Personal.find({});
    res.render("personal/index", { personals })
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("personal/new");
});

router.post("/", isLoggedIn, validatePersonal, catchAsync(async (req, res) => {
    const personal = new Personal(req.body.personal);
    await personal.save();
    req.flash("success", "Creaste de forma exitosa a un nuevo empleado!")
    res.redirect(`/personal/${personal._id}`)
}));

router.get("/:id", catchAsync(async (req, res) => {
    const personal = await Personal.findById(req.params.id).populate("reviews");
    if(!personal){
        req.flash("error", "No puedo encontrar lo que buscas!");
        return res.redirect("/personal");
    }
    res.render("personal/show", { personal });
}));

router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const personal = await Personal.findById(req.params.id)
    if(!personal){
        req.flash("error", "No puedo encontrar lo que buscas!");
        return res.redirect("/personal");
    }
    res.render("personal/edit", { personal });
}));

router.put("/:id", isLoggedIn, validatePersonal, catchAsync(async (req, res) => {
    const { id } = req.params;
    const personal = await Personal.findByIdAndUpdate(id, { ...req.body.personal });
    req.flash("success", "Modificaste la información del empleado!")
    res.redirect(`/personal/${personal._id}`)
}));

router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Personal.findByIdAndDelete(id);
    req.flash("success", "Eliminaste la información del empleado!")
    res.redirect("/personal");
}));

module.exports = router;
