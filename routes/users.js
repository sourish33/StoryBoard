const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")




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

router.get("/test", ensureAuth, async (req, res)=>{
    console.log("Hello from test")
    console.log(req.user)
    res.redirect("/stories")
})

router.get("*", (req, res) => {
  
    // Here user can also design an
    // error page and render it 
    res.send("You are in user but this page doesn't exist");
  });


// remove a story from a users list of like stories

module.exports = router