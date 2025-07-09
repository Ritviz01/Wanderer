const express = require("express")     //basic
const app = express();                 //basic
const mongoose = require("mongoose")   //basic
const Listing = require("./models/listing.js")
const path = require('path');
const { log } = require("console");
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema } = require("./schema.js")

let MONGO_URL = 'mongodb://127.0.0.1:27017/wanderer' //basic

main() //basic
    .then(() => {      //basic
        console.log('connected to DB');  //basic

    })
    .catch((err) => {  //basic
        console.log(err);  //basic 

    })

async function main() {   //basic
    await mongoose.connect(MONGO_URL)   //basic
}

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')))

app.get("/", (req, res) => {     //basic
    res.send("Hi")     //basic
})

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error); //joi givin error here
    } else {
        next();
    }


}





//Index Route

app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })

}))

//create route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs')

})

//new route = Read
app.get("/listings/new", (req, res) => {
    res.render('listings/new.ejs')
})



//show route 
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
}))




//create route = Read 
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect('/listings')



}))

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Enter the valid data for listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`);
}))

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id)
    console.log(deleteListing);
    res.redirect('/listings')

}))


app.all(/^.*$/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!"))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message);
});





app.listen(8080, () => {   //basic
    console.log("server is listening to port 8080");   //basic

})



