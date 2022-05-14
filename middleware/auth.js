const ensureAuth = (req, res, next) =>{
    if (req.isAuthenticated()) {
        console.log(req)
        return next()
    } else {
        res.redirect('/')
    }
}

const ensureGuest = (req, res, next) =>{
    if (req.isAuthenticated()){
        console.log(req)
        res.redirect('/dashboard')
    } else {
        console.log("EnsureGuest: was not authenticated!")
        return next()
    }
}

module.exports.ensureAuth = ensureAuth
module.exports.ensureGuest = ensureGuest