const express = require("express");
const { route } = require("./listing");
const router = express.Router({ mergeParams: true });  //mergeParams: true lagate ho, tab parent route ka params nested router me bhi available ho jata hai.
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")

const listingReview = require("../controllers/review.js");





//reviews
//post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(listingReview.createReview))

//delete review route
router.delete("/:reviewId", isReviewAuthor, wrapAsync(listingReview.destroyReview))


module.exports = router;