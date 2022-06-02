const express = require("express")
const { route } = require(".")
const { processText, formatTime, formatTimeDateOnly, } = require("../helpers")
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
        res.render("./error/500.ejs", {error:error})
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
stories which are public
title, body, user.name, user.image
SEARCHING PUBLIC STORIES
*/
router.get("/", ensureAuth, async (req, res) => {
    try {
        const retrievedStories = await Story.find({ status: "public" })
            .sort({ updatedAt: -1 })
            .lean()
            .populate("user")
            .exec()
        retrievedStories.forEach((story) => {
            console.log(story.title)
            story.body = processText(story.body, 200)
            story.title = processText(story.title, 25)
            story.editIcon =
                story.user._id.equals(req.user._id) ? "" : "hidden"
            story.storyID = story._id
            story.updatedAt = formatTime(story.updatedAt)
        })
        res.render("./stories/index.ejs", {
            retrievedStories: retrievedStories,
        })
    } catch (error) {
        console.log(error)
    }
})
//Editing a story
router.get("/edit/:id", ensureAuth, async (req, res) =>{
    const story = await Story.findOne({_id: req.params.id}).populate("user").lean()
    if(!story){
        return res.render("error/404")
    }
    if (!story.user._id.equals(req.user._id)){
        return res.redirect("/stories")
    }
    res.render("./partials/edit.ejs", {story: story})
})
//Viewing a story
router.get("/:id", ensureAuth, async (req, res) =>{
    const story = await Story.findOne({_id: req.params.id}).populate("user").lean()
    if(!story){
        return res.render("error/404")
    }
    if (!story.user._id.equals(req.user._id) && story.status !== "public"){
        return res.redirect("/stories")
    }
    story.editIcon = story.user._id.equals(req.user._id) ? "" : "hidden"
    res.render("viewstory.ejs", {story: story, formatTimeDateOnly: formatTimeDateOnly})
})
//update story
router.put('/:id', ensureAuth, async(req, res)=>{
    req.body.user = req.user.id
    try {
        await Story.findOneAndUpdate({_id: req.params.id}, req.body)
        res.redirect("/dashboard")   
    } catch (error) {
        console.log(error)
    }
})

//delete story
router.delete('/:id', ensureAuth, async(req, res)=>{
    console.log("Deleting story"+req.params.id)                                                                           
    try {
        await Story.findByIdAndDelete({_id: req.params.id})
        res.redirect("/dashboard") 
    } catch (error) {
        console.log(error)
    }
   
})

//Update status of story
router.patch('/:id', ensureAuth, async(req, res)=>{
    const id = req.params.id
    const status = req.body.status
    try {
        await Story.findByIdAndUpdate({_id:id}, {status: status})
        res.redirect("/dashboard") 
    } catch(error){
        console.log(error)
    }
})

module.exports = router
