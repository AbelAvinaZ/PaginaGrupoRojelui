const express = require("express");
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Personal = require("../models/personal");
const Review = require("../models/review");


router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const personal = await Personal.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    personal.reviews.push(review);
    await review.save();
    await personal.save();
    req.flash("success", "Creaste una reseña nueva!")
    res.redirect(`/personal/${personal._id}`);
}));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    Personal.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Eliminaste la reseña!")
    res.redirect(`/personal/${id}`);
}));

module.exports = router;