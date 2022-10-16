const ensureAuth = (req, res, next) =>{
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/')
    }
}

const ensureAuthAdmin = (req, res, next) =>{
    if (req.isAuthenticated() && req.user.role==="admin") {
        // console.log("EnsureAuth Speaking. The user is:")
        // console.log(req.user)
        return next()
    } else {
        res.redirect('/')
    }
}

const ensureGuest = (req, res, next) =>{
    if (req.isAuthenticated()){
        console.log(req.user.firstName)
        // res.render('dashboard.ejs', {firstName: req.user.firstName})
        res.redirect('/dashboard')
    } else {
        // console.log("EnsureGuest: was not authenticated!")
        return next()
    }
}

module.exports.ensureAuth = ensureAuth
module.exports.ensureAuthAdmin = ensureAuthAdmin
module.exports.ensureGuest = ensureGuest