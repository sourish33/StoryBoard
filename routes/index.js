const e = require("express")
const express = require("express")
const {formatTimeShort, getPublicStories } = require("../helpers")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")

//  @desc landing page
// @route GET / res.render('index', { messages: req.flash('info') });

router.get(["/", "/login"], ensureGuest, (req, res) => {
    res.render("login.ejs")
})


const getPopularAuthors = async (req, res, next) => {
    let authors = await User.find({}).lean().exec()
    let storyQueries = authors.map(el=>Story.find({user: el._id}).lean().exec())
    let stories = await Promise.all(storyQueries)

    for (let i=0;i<authors.length; i++){
        authors[i].totalStories = stories[i].length
        authors[i].totalLikes = stories[i].map(el=>el.likes).reduce((acc,cur)=>acc+cur)
    }
    let popularAuthors = authors.sort((x,y)=>y.totalLikes-x.totalLikes).slice(0, 3)
    req.popularAuthors = popularAuthors
    next()
}



// GET ALL stories belonging to user
//@route  GET /auth/google/callback
router.get("/dashboard", ensureAuth, getPublicStories, getPopularAuthors, async (req, res) => {
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
            .populate("user")
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
        console.log(req.popularAuthors)

        res.render("dashboard.ejs", {
            firstName: req.user.firstName,
            stories,
            likedStories,
            numStories,
            numLikedStories,
            trendingStories,
            popularAuthors: req.popularAuthors,
            totalStories: req.totalStories,
            formatTimeShort
        })
    } catch (error) {
        console.log(error)
        res.render("error/500", { error: error })
    }
})



module.exports = router
