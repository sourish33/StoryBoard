const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const Story = require("../models/Story")
const User = require("../models/User")

// One time route for adding the new field "liked" to all documents that don't have it
router.post('/addfield', async (req, res) =>{
    try {
        // const res = await Story.updateMany( { likedBy: { $exists: false } },{$set : {likedBy: []} })
        const res = await Story.updateMany( { likes: { $exists: false } },{$set : {likes:0} })
        console.log(res.matchedCount)
        return res.send({
            status: "Done"
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
        const res = await User.updateMany({}, {liked: []} )
        console.log(res.matchedCount)
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

module.exports = router