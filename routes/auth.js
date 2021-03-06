const express = require("express")
const bcrypt= require('bcrypt')
const router = express.Router()
const passport = require("passport")
const { ensureGuest } = require("../middleware/auth")
const User = require("../models/User")

//  @desc Auth with google
// @route GET /auth/google

router.get("/google", passport.authenticate("google", { scope: ["profile"] }))

// @desc google auth callback
//@route  GET /auth/google/callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/dashboard")
    }
)

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

router.post('/login', ensureGuest, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect:'/login',
    failureFlash: true
}))

router.post("/register", ensureGuest, async (req, res)=>{
    try {
        const existingUser = await User.findOne({email: req.body.email})
        if (existingUser) {
            req.flash('error', 'Email already exists')
            return res.redirect("/login")
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {
            displayName: `${req.body.firstName} ${req.body.lastName}`,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password:hashedPassword
        }
        await User.create(user)
        req.flash('error', 'Account Successfully Created!!');
        res.redirect("/login")
    } catch (err) {
        res.render("./error/500.ejs", {error: err})
    }

})



module.exports = router
