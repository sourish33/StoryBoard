const e = require("express")
const express = require("express")
const {formatTimeShort, getPublicStories, getPopularAuthors, processText } = require("../helpers")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")

//  @desc landing page
// @route GET / res.render('index', { messages: req.flash('info') });

router.get(["/", "/login"], ensureGuest, (req, res) => {
    res.render("login.ejs")
})



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

        console.log(req.user.role)

        res.render("dashboard.ejs", {
            _id: req.user._id,
            firstName: req.user.firstName,
            stories,
            likedStories,
            numStories,
            numLikedStories,
            trendingStories,
            popularAuthors: req.popularAuthors,
            totalStories: req.totalStories,
            role: req.user.role,
            formatTimeShort,
            processText,
        })
    } catch (error) {
        console.log(error)
        res.render("error/500", { error: error })
    }
})




module.exports = router
