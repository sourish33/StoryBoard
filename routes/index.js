const express = require('express')
const { formatTime, formatTimeShort, countLikesForAllStories } = require('../helpers')
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
        let query = {user: req.user._id}
        const numStories = await Story.countDocuments(query)
        let stories = await Story.find(query).sort({ createdAt: -1 }).lean() || []
        // counting likes and adding a "likes" field to each story with the totla number of likes
        stories = await countLikesForAllStories(stories)
        let thisUser  = await User.findOne({_id:req.user._id}).populate('liked').lean()
        likedStories = thisUser.liked
        numLikedStories = likedStories.length
        likedStories = await countLikesForAllStories(likedStories)
        res.render('dashboard.ejs', {firstName: req.user.firstName, stories, likedStories, numStories, numLikedStories, formatTimeShort: formatTimeShort})
    } catch (error) {
        console.log(error)
        res.render('error/500', {error:error})
    }
})

// One time route for adding the new field "liked" to all documents that don't have it
// router.post('/addfield', async (req, res) =>{
//     try {
//         const res = await User.updateMany( { liked: { $exists: false } },{$set : {liked: []} })   
//         console.log(res.matchedCount)
//         return res.send({
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