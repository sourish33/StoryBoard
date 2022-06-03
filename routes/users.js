const express = require("express")
const router = express.Router()
const { ensureAuth } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")




//add a story to a users list of liked stories
router.patch("/addlike/:id", ensureAuth, async (req, res)=>{
    console.log("Hello from addlike!!!")
    const userid = req.params.id
    const storyID = req.body.storyID
    console.log(`userid = ${userid}`)
    console.log(`storyid = ${storyID}`)
    try {
        const updatedUser = await User.findOneAndUpdate(
            {_id: userid}, 
            { $addToSet: { liked: [storyID] } }
            )
        // res.redirect("/stories")
        res.render("./error/output.ejs", {data: updatedUser})
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