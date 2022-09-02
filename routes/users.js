const express = require("express")
const { removeLikes, addLikes, removeAllLikes, processStories, processLikedBy } = require("../helpers")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")

//add or remove a like
router.patch("/addRemoveLike", ensureAuth, async (req, res) => {
    const userid = req.body.userid
    const storyID = req.body.storyID
    console.log(`userid=${userid}/nstoryid=${storyID}`)
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
        console.log(data)
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
    const userid = req.user._id
    try {
        await removeAllLikes(userid)
        res.redirect("/dashboard")
    } catch (err) {
        res.status(500).render("./error/500.ejs", { error: err })
    }
})

//show profile of user with _id: id
router.get("/profile/:id", ensureAuth, async (req, res) =>{
    const authorId = req.params.id
    try {
        const authorq = User.findOne({_id : authorId}).lean().exec()
        const thierStoriesq = Story.find({user: authorId, status: "public"}).populate("likedBy").sort({createdAt: -1}).lean().exec()
        const [author, thierStories] = await Promise.all([authorq, thierStoriesq])
        author.stories = processStories(req, thierStories)
        res.render('./user/userpage-view.ejs', {
            author, 
            user: req.user, 
            loggedIn: author._id.equals(req.user._id),
            processLikedBy,
        })
    } catch (error) {
        res.status(500).render("./error/500.ejs", { error })
    }
})

//show edit page
router.get("/edit/:id", ensureAuth, async (req, res) =>{

    try {
        const authorId = req.params.id
        const author = await User.findOne({_id: authorId}).lean().exec()
        if (!author){
            return res.render('./error/noaccess.ejs') 
        }
        const loggedIn =  author._id.equals(req.user._id)
        if (loggedIn){
            return res.render('./user/userpage-edit.ejs', {
                author, 
                user: req.user, 
            }) 
        }
        return res.render('./error/noaccess.ejs') 
    } catch (error) {
        res.status(500).render("./error/500.ejs", { error })
    }

})

//edit user details
router.post("/edit/:id", ensureAuth, async (req, res) =>{

    try {
        const authorId = req.params.id
        console.log(authorId)
        console.log(req.body)
        return
    } catch (error) {
        res.status(500).render("./error/500.ejs", { error })
    }

})


module.exports = router
