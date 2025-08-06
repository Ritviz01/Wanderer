const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review.js')

const listingSchema = new Schema({
    title: String,

    description: String,


    image: {
        filename: {
            type: String,
            default: 'https://plus.unsplash.com/premium_photo-1686090449192-4ab1d00cb735?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },


        url: {

            type: String
        }
    },
    price: Number,

    location: String,

    country: String,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"

        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'

        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;