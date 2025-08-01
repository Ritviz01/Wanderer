const Listing = require("../models/listing")
const User = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Welcome to Wanderer')
        return res.redirect('/listings');
    })

}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = async (req, res) => {  //Passport provides an authenticate() function, which is used as route middleware to authenticate requests.
    req.flash("success", "Welcome back to Wanderer  ")
    res.redirect(res.locals.redirectUrl || "/listings")
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);

        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}