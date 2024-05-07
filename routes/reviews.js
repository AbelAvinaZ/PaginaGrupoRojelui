const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Personal = require("../models/personal");
const Review = require("../models/review");

const { reviewSchema } = require("../schemas");



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req, res) => {
    const personal = await Personal.findById(req.params.id);
    const review = new Review(req.body.review);
    personal.reviews.push(review);
    await review.save();
    await personal.save();
    req.flash("success", "Creaste una reseña nueva!")
    res.redirect(`/personal/${personal._id}`);
}));

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    Personal.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Eliminaste la reseña!")
    res.redirect(`/personal/${id}`);
}));

module.exports = router;