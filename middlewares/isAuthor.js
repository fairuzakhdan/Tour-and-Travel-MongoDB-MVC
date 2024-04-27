const Place = require('../models/place')
const Review = require('../models/review')

const isAuthorPlace = async (req, res,next) => {
    const { id } = req.params
    let place = await Place.findById(id)

    if(!place.author.equals(req.user._id)) {
        req.flash('error_msg','Not Authorized')
        return res.redirect('/places')
    }
    next()
}

const isAuthorReview = async (req, res,next) => {
    const { idPlace,idReviews } = req.params
    let review = await Review.findById(idReviews)

    if(!review.author.equals(req.user._id)) {
        req.flash('error_msg','Not Authorized')
        return res.redirect(`/places/${idPlace}`)
    }
    next()
}

module.exports = {isAuthorPlace, isAuthorReview}