const express = require("express")
const {formatTimeShort, getPublicStories } = require("../helpers")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")

//  @desc landing page
// @route GET / res.render('index', { messages: req.flash('info') });

router.get(["/", "/login"], ensureGuest, (req, res) => {
    // console.log("the message is"+ req.flash('message'))
    res.render("login.ejs")
})

// GET ALL stories belonging to user
//@route  GET /auth/google/callback
router.get("/dashboard", ensureAuth, getPublicStories, async (req, res) => {
    let showAllWrote = req.query.showAllWrote || "0"
    let showAllLiked = req.query.showAllLiked || "0"
    try {
        let storiesQuery = Story.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean()
        let thisUserQuery = User.findOne({ _id: req.user._id })
            .populate("liked")
            .lean()
        let trendingStoriesQuery = Story.find({ status: "public" })
            .sort({ likes: -1, updatedAt: -1 })
            .limit(3)
        let [stories, thisUser, trendingStories] = await Promise.all([
            storiesQuery,
            thisUserQuery,
            trendingStoriesQuery,
        ])
        const numStories = stories.length
        if (numStories > 5 && !(showAllWrote === "1")) {
            stories = stories.slice(0, 5)
        }
        likedStories = thisUser.liked.filter((el) => el.status === "public")
        numLikedStories = likedStories.length
        if (numLikedStories > 5 && !(showAllLiked === "1")) {
            likedStories = likedStories.slice(0, 5)
        }

        res.render("dashboard.ejs", {
            firstName: req.user.firstName,
            stories,
            likedStories,
            numStories,
            numLikedStories,
            trendingStories,
            formatTimeShort: formatTimeShort,
        })
    } catch (error) {
        console.log(error)
        res.render("error/500", { error: error })
    }
})

// One time route for adding the new field "liked" to all documents that don't have it
// router.post('/addfield', async (req, res) =>{
//     try {
//         // const res = await Story.updateMany( { likedBy: { $exists: false } },{$set : {likedBy: []} })
//         const res = await Story.updateMany( { likes: { $exists: false } },{$set : {likes:0} })
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

//One time route for clearing all likes of all users
// router.patch('/clearlikes', async (req, res) =>{
//     try {
//         const res = await User.updateMany({}, {liked: []} )
//         console.log(res.matchedCount)
//         return res.send({
//             status: "Updated"
//         })

//     } catch (err) {
//         res.send({
//             status:"Bad",
//             error: err
//         })
//     }

// })

module.exports = router
