const express = require('express')
const { formatTime, formatTimeShort } = require('../helpers')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const Story= require('../models/Story')
const User = require('../models/User')


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

// One time route for adding the new field "liked" to all documents that don't have it
// router.post('/addfield', async (req, res) =>{
//     try {
//         const res = await User.updateMany( { liked: { $exists: false } },{$set : {liked: []} })   
//         console.log(res.matchedCount)
//         res.send({
//             status: "Done"
//         })
        
//     } catch (err) {
//         res.send({
//             status:"Done",
//             error: err
//         })
//     }

// })



module.exports = router