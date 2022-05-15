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
        const stories = await Story.find({user: req.user.id})
        console.log(stories)
    } catch (error) {
        console.log(error)
        return res.render('error/500')
    }
    res.render('dashboard.ejs', {firstName: req.user.firstName})
})



module.exports = router