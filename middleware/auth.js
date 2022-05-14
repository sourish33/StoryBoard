const ensureAuth = (req, res, next) =>{
    if (req.isAuthenticated()) {
        return next()
    } else {
        console.log("EnsureAuth: was not authenticated!")
        res.redirect('/')
    }
}

const ensureGuest = (req, res, next) =>{
    if (req.isAuthenticated()){
        res.redirect('/dashboard')
    } else {
        console.log("EnsureGuest: was not authenticated!")
        return next()
    }
}

module.exports.ensureAuth = ensureAuth
module.exports.ensureGuest = ensureGuest