const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")


//add or remove a like
router.patch('/addRemoveLike', ensureAuth, async (req, res) =>{
    console.log("Hello from addRemoveLike!!!")
    const userid = req.user._id
    const storyID = req.body.storyID
    // console.log(`Author: ${req.user._id}`)
    // console.log(`userid = ${userid}`)
    // console.log(`storyid = ${storyID}`)
    try {
        const theUser = await User.findById(userid).lean()
        const theUserLiked = theUser.liked.map(el=>el.toString())
        // console.log(theUserLiked)
        let likeButtonSize = "big"
        if (theUserLiked.includes(storyID)) {
            const updatedUser = await User.updateOne(
                {_id: userid}, 
                { $pull: { liked: storyID } }
            )
            likeButtonSize = "small"
        } else{
            const updatedUser = await User.updateOne(
                {_id: userid}, 
                { $addToSet: { liked: storyID } }
            )
        }
        //get updated number of likes
        const numLikes = await User.find({liked: storyID}).countDocuments()

        //prepare data to send back
        const data = {
            likeButtonSize: likeButtonSize,
            numLikes: numLikes
        }
        console.log(data)
        res.status(200).json(data)
        // res.status(200).render('./error/output.ejs', {data: data})

    } catch (err) {
        res.status(404).render("./error/500.ejs", {error: err})
    }
    
    
}) 


//add a story to a users list of liked stories
router.patch("/addlike", ensureAuth, async (req, res)=>{
    console.log("Hello from addlike!!!")
    const userid = req.user._id
    const storyID = req.body.storyID
    // console.log(`Author: ${req.user._id}`)
    // console.log(`userid = ${userid}`)
    // console.log(`storyid = ${storyID}`)
    try {
        const theUser = await User.findById(userid).lean()
        const theUserLiked = theUser.liked.map(el=>el.toString())
        // console.log(theUserLiked)
        if (theUserLiked.includes(storyID)) {
            const updatedUser = await User.updateOne(
                {_id: userid}, 
                { $pull: { liked: storyID } }
            )
        } else{
            const updatedUser = await User.updateOne(
                {_id: userid}, 
                { $addToSet: { liked: storyID } }
            )
        }
        res.redirect("/stories")

    } catch (err) {
        res.status(404).render("./error/500.ejs", {error: err})
    }
})

//doesn't do anythng useful
router.post("/test",  async (req, res)=>{
    console.log("Hello from test")
    // const keys = Object.keys(req)
    console.log(req.body)
    res.status(200).json({
        status: "OK",
        data: "everything good"
    })
})

router.get("*", (req, res) => {
  
    // Here user can also design an
    // error page and render it 
    res.send("You are in user but this page doesn't exist");
  });



module.exports = router