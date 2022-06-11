const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")


//add or remove a like
router.patch('/addRemoveLike', async (req, res) =>{
    const userid = req.body.userid
    const storyID = req.body.storyID
    // console.log(`userid = ${userid}`)
    // console.log(`storyid = ${storyID}`)
    let likeButtonSize ="small"
    try {
        const theUser = await User.findById(userid).lean()
        const theUserLiked = theUser.liked.map(el=>el.toString())
        // console.log(theUserLiked)
        if (theUserLiked.includes(storyID)) {
            const updatedUser = await User.updateOne(
                {_id: userid}, 
                { $pull: { liked: storyID } }
            )
            likeButtonSize="small"
        } else{
            const updatedUser = await User.updateOne(
                {_id: userid}, 
                { $addToSet: { liked: storyID } }
            )
            likeButtonSize="big"
        }
        //get updated number of likes
        const numLikes = await User.find({liked: storyID}).countDocuments()

        //prepare data to send back
        const data = {
            likeButtonSize,
            numLikes
        }
        // console.log(data)
        res.status(200).json(data)

    } catch (err) {
        res.status(404).render("./error/500.ejs", {error: err})
    }
     
}) 


//REMOVE a story from a users list of liked stories
router.patch("/removeLike", ensureAuth, async (req, res)=>{
    // console.log("Hello from removelike!!!")
    const userid = req.user._id
    const storyID = req.body.storyID
    try {
        await User.findByIdAndUpdate(userid, { $pull: { liked: storyID } })
        res.redirect('/dashboard')

    } catch (err) {
        res.status(404).render("./error/500.ejs", {error: err})
    }
})

//Remove all likes
router.patch("/removeAllLikes", ensureAuth, async (req, res) =>{
    // console.log("Hello from removeAllLikes")
    const userid = req.user._id
    try {
        await User.findByIdAndUpdate(userid, {$set: { liked: [] } })
        res.redirect('/dashboard')

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
    res.send("You are in users but this page doesn't exist");
  });



module.exports = router