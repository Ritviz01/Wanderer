const express = require("express");
const { route } = require("./listing");
const router = express.Router({ mergeParams: true });  //mergeParams: true lagate ho, tab parent route ka params nested router me bhi available ho jata hai.
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")







//reviews
//post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;


    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created")


    res.redirect(`/listings/${listing._id}`)

}))

//delete review route
router.delete("/:reviewId", isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Created")

    res.redirect(`/listings/${id}`)
}))


module.exports = router;