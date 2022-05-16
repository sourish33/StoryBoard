const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story= require('../models/Story')


//  @desc Show Add page
// @route GET /


router.get('/add', ensureAuth,(req,res)=>{
    res.render('./partials/add.ejs')
})

router.post('/', ensureAuth, async (req, res)=>{
    try {
        req.body.user = req.user.id
        console.log(req.body)
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('./error/500.ejs')
        
    }
})


module.exports = router