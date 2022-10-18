const express = require("express")
const {
    formatTimeDateOnly,
    getPublicStories,
    promisesToDeleteOneStory,
} = require("../helpers")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")


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
            role: req.user.role,
            sortby: req.sortby,
            sortByAuthor: req.sortByAuthor,
            paginationData: req.paginationData,
            pageNumber: req.pageNumber,
            numStories: req.numStories,
            authors: req.authors
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
    story.editIcon = story.user._id.equals(req.user._id) ? "" : "hidden"
    res.render("viewstory.ejs", {
        user: req.user,
        story: story,
        formatTimeDateOnly,
    })
})
//update story
router.put("/:id", ensureAuth, async (req, res) => {
    req.body.user = req.user.id
    try {
        await Story.findOneAndUpdate({ _id: req.params.id }, req.body)
        res.redirect(`/stories/${req.params.id}`)
    } catch (error) {
        console.log(error)
    }
})



//delete story
router.delete("/:id", ensureAuth, async (req, res) => {
    try {
        console.log("trying to delete")
        let storyID =req.params.id
        let promisesToDeleteOne = promisesToDeleteOneStory(storyID)
        await Promise.all(promisesToDeleteOne)
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
