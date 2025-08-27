if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
// console.log(process.env.SECRET)

const express = require("express")
const app = express();                 //basic
const mongoose = require("mongoose")   //basic
const path = require('path');
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")

const lisitngsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")



const passport = require("passport")
const localStrategy = require('passport-local')
const User = require("./models/user.js")

//let MONGO_URL = 'mongodb://127.0.0.1:27017/wanderer'  
const dbUrl = process.env.ATLASDB_URL;


main()
    .then(() => {
        console.log('connected to DB');
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl)
}

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,

    },
    touchAfter: 24 * 3600,
})



store.on("error", () => {
    console.log("ERROR in mongo sesssion Store");

})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



app.use(session(sessionOptions))   //express session : use cookies to make the site sort of stateful
app.use(flash())                  //used to display some messages for a some milli second

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))   //user should be authenticate through  authenticate 
passport.serializeUser(User.serializeUser())        //storing all the data of the user in session can be said as serilization
passport.deserializeUser(User.deserializeUser())   //unstoring all the data of the user from session can be said as deserilization


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})




app.use('/listings', lisitngsRouter);
app.use('/', lisitngsRouter);
app.use('/listings/:id/reviews', reviewsRouter)
app.use('/', userRouter)


app.all(/^.*$/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!"))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message })
    // res.status(statusCode).send(message);
});


app.listen(8080, () => {   //b a s i c
    console.log("server is listening to port 8080");   //basic

})



