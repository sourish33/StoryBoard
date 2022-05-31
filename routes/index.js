const express = require('express')
const { formatTime, formatTimeShort } = require('../helpers')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const Story= require('../models/Story')


//  @desc landing page
// @route GET / res.render('index', { messages: req.flash('info') });


router.get(['/', '/login'], ensureGuest,(req,res)=>{
    // console.log("the message is"+ req.flash('message'))
    res.render('login.ejs')
})

// GET ALL stories belonging to user
//@route  GET /auth/google/callback
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        let stories = await Story.find({user: req.user._id}).sort({ createdAt: -1 }).lean() || []
        res.render('dashboard.ejs', {firstName: req.user.firstName, stories: stories, formatTimeShort: formatTimeShort})
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})



module.exports = router