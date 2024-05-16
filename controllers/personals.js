const Personal = require("../models/personal");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const personals = await Personal.find({});
    res.render("personal/index", { personals })
}

module.exports.renderNewForm = (req, res) => {
    res.render("personal/new");
}

module.exports.createPersonal = async (req, res) => {
    const personal = new Personal(req.body.personal);
    personal.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    personal.author = req.user._id;
    await personal.save();
    req.flash("success", "Creaste de forma exitosa a un nuevo empleado!")
    res.redirect(`/personal/${personal._id}`)
}

module.exports.showPersonal = async (req, res) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const personal = await Personal.findById(id);
    if (!personal) {
        req.flash("error", "No puedo encontrar lo que buscas!");
        return res.redirect("/personal");
    }
    res.render("personal/edit", { personal });
}

module.exports.updatePersonal = async (req, res) => {
    const { id } = req.params;
    const personal = await Personal.findByIdAndUpdate(id, { ...req.body.personal });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    personal.images.push(...imgs);
    await personal.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await personal.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", "Modificaste la información del empleado!")
    res.redirect(`/personal/${personal._id}`)
}

module.exports.deletePersonal = async (req, res) => {
    const { id } = req.params;
    await Personal.findByIdAndDelete(id);
    req.flash("success", "Eliminaste la información del empleado!")
    res.redirect("/personal");
}