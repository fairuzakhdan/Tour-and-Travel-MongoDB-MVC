const Review = require('../models/review')
const Place = require("../models/place")

const createReview = async (req, res) => {
    const { idPlace } = req.params;

    const review = new Review(req.body.review);
    review.author = req.user._id
    await review.save();
    
    const place = await Place.findById(idPlace);
    place.reviews.push(review);
    await place.save();

    req.flash("success_msg", "Review add successfully");
    res.redirect(`/places/${idPlace}`);
  }

  const destroyReview = async (req, res) => {
    const { idPlace, idReviews } = req.params;
    await Place.findByIdAndUpdate(idPlace, { $pull: { reviews: idReviews } });
    await Review.findByIdAndDelete(idReviews);
    req.flash("success_msg", "Review delete successfully");
    res.redirect(`/places/${idPlace}`);
  }

  module.exports = { createReview, destroyReview }