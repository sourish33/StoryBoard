const ensureAuth = (req, res, next) =>{
    if (req.isAuthenticated()) {
        // console.log(req.user.firstName)
        return next()
    } else {
        res.redirect('/')
    }
}

const ensureGuest = (req, res, next) =>{
    if (req.isAuthenticated()){
        console.log(req.user.firstName)
        res.render('dashboard.ejs', {firstName: req.user.firstName})
    } else {
        console.log("EnsureGuest: was not authenticated!")
        return next()
    }
}

module.exports.ensureAuth = ensureAuth
module.exports.ensureGuest = ensureGuest