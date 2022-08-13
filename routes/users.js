const express = require("express")
const { removeLikes, addLikes, removeAllLikes } = require("../helpers")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")

//add or remove a like
router.patch("/addRemoveLike", ensureAuth, async (req, res) => {
    const userid = req.body.userid
    const storyID = req.body.storyID
    // console.log(`userid = ${userid}`)
    // console.log(`storyid = ${storyID}`)
    let likeButtonSize = "small"
    let updatedUser = null
    let updatedStory = null
    try {
        const theUser = await User.findById(userid).lean()
        const theUserLiked = theUser.liked.map((el) => el.toString())
        if (theUserLiked.includes(storyID)) {
            //removing a like
            ;({ updatedUser, updatedStory } = await removeLikes(
                userid,
                storyID
            ))
            likeButtonSize = "small"
        } else {
            ;({ updatedUser, updatedStory } = await addLikes(userid, storyID))
            likeButtonSize = "big"
        }
        //get updated number of likes     
        const numLikes = updatedStory.likes


        //prepare data to send back
        const data = {
            likeButtonSize,
            numLikes,
        }
        // console.log(data)
        res.status(200).json(data)
    } catch (err) {
        res.status(404).render("./error/500.ejs", { error: err })
    }
})

//REMOVE a story from a users list of liked stories
router.patch("/removeLike", ensureAuth, async (req, res) => {
    const userid = req.user._id
    const storyID = req.body.storyID
    try {
        const { updatedUser, updatedStory } = await removeLikes(userid, storyID)
        res.redirect("/dashboard")
    } catch (err) {
        res.status(404).render("./error/500.ejs", { error: err })
    }
})

//Remove all likes
router.patch("/removeAllLikes", ensureAuth, async (req, res) => {
    // console.log("Hello from removeAllLikes")
    const userid = req.user._id
    try {
        await removeAllLikes(userid)
        res.redirect("/dashboard")
    } catch (err) {
        res.status(500).render("./error/500.ejs", { error: err })
    }
})


router.get("/profile/:id", async (req, res) =>{
    const authorId = req.params.id
    try {
        const authorq = User.findOne({_id : authorId}).lean().exec()
        const thierStoriesq = Story.find({user: authorId, status: "public"}).lean().exec()
        const [author, thierStories] = await Promise.all([authorq, thierStoriesq])
        author.stories = thierStories
        console.log(author)
        res.render('./user/userpage-view.ejs', {author})
    } catch (error) {
        res.status(500).render("./error/500.ejs", { error })
    }
})

router.get("*", (req, res) => {
    // Here user can also design an
    // error page and render it
    res.send("You are in users but this page doesn't exist")
})

module.exports = router
