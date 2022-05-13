const express = require("express")
const router = express.Router()
const passport = require("passport")

//  @desc Auth with google
// @route GET /auth/google

router.get("/google", passport.authenticate("google", { scope: ["profile"] }))

// @desc google auth callback
//@route  GET /auth/google/callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("dashboard.ejs", { adj: "fucking", title: "Dashboard" })
    }
)

// router.get("/login", (req, res) => {
//     res.render("login.ejs", { title: "Logindro" })
// })

module.exports = router
