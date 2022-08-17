const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const bcrypt = require('bcrypt')
const Story = require("../models/Story")
const User = require("../models/User")

// One time route for adding new fields
router.patch('/addfield', async (req, res) =>{
    try {
        // const res = await Story.updateMany( { likedBy: { $exists: false } },{$set : {likedBy: []} })
        // const res = await Story.updateMany( { likes: { $exists: false } },{$set : {likes:0} })
        const result = await User.updateMany( { role: { $exists: false } },{$set : {role: "user"} })
        console.log(result.matchedCount)
        return res.send({
            status: "Done",
            count: result.matchedCount
        })

    } catch (err) {
        res.send({
            status:"Done",
            error: err
        })
    }

})

//One time route for clearing all likes of all users
router.patch('/clearlikes', async (req, res) =>{
    try {
        const result = await User.updateMany({}, {liked: []} )
        console.log(result.matchedCount)
        return res.send({
            status: "Updated"
        })

    } catch (err) {
        res.send({
            status:"Bad",
            error: err
        })
    }

})

router.patch('/resetpasswords', async (req, res)=>{
    try {
        const hashedPassword = await bcrypt.hash("pwd", 10)
        const updated = await User.updateMany({}, {password: hashedPassword})
        return res.send({
            status: "Updated",
            count: updated.matchedCount
        })
    } catch (error) {
        res.send({
            status:"Bad",
            error: error
        })
    }

    
})

//grabs all the stories and checks if likedby number mateches likes
router.get('/checklikes', async (req, res)=>{
    try {
        const results = await Story.find({})
        let bads = []
        let goods =0
        for (let result of results){
            if (result.likes !== result.likedBy.length){
                bads.push(result)
            }else{
                goods++
            }
        }
        // const condensed = results.map(el=>{
        //     let {_id, title, status, user, likedBy, likes} = el
        //     return {_id, title, status, user, likedBy, likes} 
        // })
        // console.log(condensed)
            

        return  res.send({
            status: "OK",
            results,
            bads,
            goods 
        })
        
    } catch (error) {
        res.send({
            status:"Bad",
            error: err
        })
    }
    
})


//doesn't do anythng useful
router.post("/test", async (req, res) => {
    console.log("Hello from test")
    // const keys = Object.keys(req)
    console.log(req.body)
    res.status(200).json({
        status: "OK",
        data: "everything good",
    })
})

//delete all stories
router.delete("/delete-all-stories/:id",  async (req, res) =>{
    try {
        console.log("trying to delete all stories")
        let userid = req.params.id
        deleteAllStories(userid)
        return res.send({
            status: "Done",
        })
        
    } catch (error) {
        return console.log(error)
    }
})

module.exports = router