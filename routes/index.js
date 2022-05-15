const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const Story= require('../models/Story')


//  @desc landing page
// @route GET /


router.get(['/', '/login'], ensureGuest,(req,res)=>{
    res.render('login.ejs', {title: "Login"})
})

// @desc dashboard
//@route  GET /auth/google/callback
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({user: req.user.id})
        res.render('dashboard.ejs', {firstName: req.user.firstName, stories: stories})
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})



module.exports = router