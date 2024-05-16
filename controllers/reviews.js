const Personal = require("../models/personal");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const personal = await Personal.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    personal.reviews.push(review);
    await review.save();
    await personal.save();
    req.flash("success", "Creaste una reseña nueva!")
    res.redirect(`/personal/${personal._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    Personal.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Eliminaste la reseña!")
    res.redirect(`/personal/${id}`);
}