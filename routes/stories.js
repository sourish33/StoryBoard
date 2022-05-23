const express = require("express")
const { processText, formatTime } = require("../helpers")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")

//  @desc Show Add page
// @route GET /

router.get("/add", ensureAuth, (req, res) => {
    res.render("./partials/add.ejs")
})

router.post("/", ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect("/dashboard")
    } catch (error) {
        console.error(error)
        res.render("./error/500.ejs")
    }
})

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

*/
router.get("/", ensureAuth, async (req, res) => {
    try {
        const retrievedStories = await Story.find({ status: "public" })
            .sort({ createdAt: -1 })
            .lean()
            .populate("user")
            .exec()
        retrievedStories.forEach((story) => {
            story.body = processText(story.body, 200)
            story.title = processText(story.title, 25)
            story.editIcon =
                story.user.googleId === req.user.googleId ? "" : "hidden"
            story.storyID = story._id
            story.createdAt = formatTime(story.createdAt)
        })
        res.render("./stories/index.ejs", {
            retrievedStories: retrievedStories,
        })
    } catch (error) {
        console.log(error)
    }
})

router.get("/edit/:id", ensureAuth, async (req, res) =>{
    const story = await Story.findOne({_id: req.params.id}).populate("user").lean()
    if(!story){
        return res.render("error/404")
    }
    if (story.user.googleId !== req.user.googleId){
        return res.redirect("/stories")
    }
    res.render("./partials/edit.ejs", {story: story})
})

router.get("/:id", ensureAuth, async (req, res) =>{
    const story = await Story.findOne({_id: req.params.id}).populate("user").lean()
    if(!story){
        return res.render("error/404")
    }
    if (story.user.googleId !== req.user.googleId && story.status !== "public"){
        return res.redirect("/stories")
    }
    res.render("viewstory.ejs", {story: story})
})

router.put('/:id', ensureAuth, async(req, res)=>{
    req.body.user = req.user.id
    try {
        await Story.findOneAndUpdate({_id: req.params.id}, req.body)
        res.redirect("/dashboard")   
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', ensureAuth, async(req, res)=>{
    console.log("Deleting story"+req.params.id)
    try {
        await Story.findByIdAndDelete({_id: req.params.id})
        res.redirect("/dashboard") 
    } catch (error) {
        console.log(error)
    }
   
})

module.exports = router
