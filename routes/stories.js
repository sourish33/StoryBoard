const express = require("express")
const { route } = require(".")
const {
    processText,
    formatTime,
    formatTimeDateOnly,
    countLikesForAllStories,
    paginate,
} = require("../helpers")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")

const PER_PAGE = 6

//  @desc Show Add page
// @route GET /

router.get("/add", ensureAuth, (req, res) => {
    res.render("./partials/add.ejs")
})

//@desc saving a new story
router.post("/", ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user._id
        await Story.create(req.body)
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
        res.render("./error/500.ejs", { error: error })
    }
})

//@desc updating a specific story
router.post("/:id", ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect("/dashboard")
    } catch (error) {
        console.error(error)
        res.render("./error/500.ejs")
    }
})

//Middleware to retrieve stories and likes
const getPublicStories = async (req, res, next) => {
    const sortby = req.query.sortby || "Recent"
    const ids = req.user.liked
    let numStories = 0
    if (sortby === "YouLiked") {
        numStories = await Story.find({ status: "public", _id: { $in: ids }  }).countDocuments()
    } else {
        numStories = await Story.find({ status: "public" }).countDocuments()
    }
    const pageNumber = req.query.pageNumber || 1
    const perPage = PER_PAGE
    req.paginationData = paginate(numStories, perPage)
    req.numStories = numStories
    req.pageNumber = pageNumber
    sortOption = sortby === "Oldest" ? 1 : -1
    let retrievedStories = []
    let dbquery = {}
    if (sortby === "YouLiked") {
        dbquery = Story.find({ status: "public", _id: { $in: ids } })
    } else {
        dbquery = Story.find({ status: "public" })
    }

    if (pageNumber!=="all"){
        dbquery.skip(pageNumber * perPage - perPage)
        .limit(perPage)
    }
    retrievedStories = await dbquery
        .sort({ updatedAt: sortOption })
        .lean()
        .populate("user")
        .exec()
    retrievedStories.forEach((story) => {
        story.body = processText(story.body, 200)
        story.shortTitle = processText(story.title, 25)
        story.editIcon = story.user._id.equals(req.user._id) ? "" : "hidden"
        story.storyID = story._id
        story.updatedAt = formatTime(story.updatedAt)
    })
    // counting likes and adding a "likes" field to each story with the totla number of likes
    retrievedStories = await countLikesForAllStories(retrievedStories)


    if (sortby === "MostLikes") {
        retrievedStories.sort((a, b) => {
            return a.likes > b.likes ? -1 : 1
        })
    }
    if (sortby === "LeastLikes") {
        retrievedStories.sort((a, b) => {
            return a.likes > b.likes ? 1 : -1
        })
    }
    req.retrievedStories = retrievedStories
    req.sortby = sortby
    next()
}
/*
getting PUBLIC STORIES using middleware getPublicStories
*/
router.get("/", ensureAuth, getPublicStories, async (req, res) => {
    try {
        let showfile = "index.ejs"
        if (req.query.view === "list") {
            showfile = "indexlist.ejs"
        }
        res.render(showfile, {
            retrievedStories: req.retrievedStories,
            user: req.user,
            sortby: req.sortby,
            paginationData: req.paginationData,
            pageNumber: req.pageNumber,
            numStories: req.numStories
        })
    } catch (error) {
        console.log(error)
    }
})

//Editing a story
router.get("/edit/:id", ensureAuth, async (req, res) => {
    const story = await Story.findOne({ _id: req.params.id })
        .populate("user")
        .lean()
    if (!story) {
        return res.render("error/404")
    }
    if (!story.user._id.equals(req.user._id)) {
        return res.redirect("/stories")
    }
    res.render("./partials/edit.ejs", { story: story })
})
//Viewing a story
router.get("/:id", ensureAuth, async (req, res) => {
    let story = await Story.findOne({ _id: req.params.id })
        .populate("user")
        .lean()
    if (!story) {
        return res.render("error/404")
    }
    if (!story.user._id.equals(req.user._id) && story.status !== "public") {
        return res.redirect("/stories")
    }
    //putting this story in an array, calling countLikesForAllStories which adds its number of likes and destructuring the result
    ;[story] = await countLikesForAllStories([story])
    story.editIcon = story.user._id.equals(req.user._id) ? "" : "hidden"
    res.render("viewstory.ejs", {
        story: story,
        formatTimeDateOnly: formatTimeDateOnly,
    })
})
//update story
router.put("/:id", ensureAuth, async (req, res) => {
    req.body.user = req.user.id
    try {
        await Story.findOneAndUpdate({ _id: req.params.id }, req.body)
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
    }
})

//delete story
router.delete("/:id", ensureAuth, async (req, res) => {
    try {
        await Story.findByIdAndDelete({ _id: req.params.id })
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
    }
})

//Update status of story
router.patch("/:id", ensureAuth, async (req, res) => {
    const id = req.params.id
    const status = req.body.status
    try {
        await Story.findByIdAndUpdate(
            { _id: id },
            { status: status },
            { timestamps: false }
        ) //prevents an updatedAt timestamp for this
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
    }
})

module.exports = router
