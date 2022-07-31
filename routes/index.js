const express = require('express')
const { formatTime, formatTimeShort, countLikesForAllStories, getPublicStories } = require('../helpers')
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
router.get('/dashboard', ensureAuth, getPublicStories, async (req, res) => {
    let showAllWrote = req.query.showAllWrote || "0"
    let showAllLiked = req.query.showAllLiked || "0"
    try {
        const numStories = await Story.countDocuments({user: req.user._id})
        let dbquery = Story.find({user: req.user._id})
        if (numStories>5 && !(showAllWrote==="1")) {
            console.log("trying to limit")
            dbquery.limit(5)
        }
        let stories = await dbquery.sort({ createdAt: -1 }).lean() || []
        // counting likes and adding a "likes" field to each story with the totla number of likes
        stories = await countLikesForAllStories(stories)
        let thisUser  = await User.findOne({_id:req.user._id}).populate('liked').lean()
        likedStories = thisUser.liked.filter(el=>el.status === "public")
        numLikedStories = likedStories.length
        if (numLikedStories>5 && !(showAllLiked==="1")){
            likedStories = likedStories.slice(0,5)
        }

        //getting all trending stories
        const trendingStories = req.retrievedStories.slice(0, 3)
    
        likedStories = await countLikesForAllStories(likedStories)
        res.render('dashboard.ejs', {firstName: req.user.firstName, stories, likedStories, numStories, numLikedStories, trendingStories, formatTimeShort: formatTimeShort})
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