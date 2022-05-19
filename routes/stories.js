const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story= require('../models/Story')
const User = require('../models/User')


//  @desc Show Add page
// @route GET /


router.get('/add', ensureAuth,(req,res)=>{
    res.render('./partials/add.ejs')
})

router.post('/', ensureAuth, async (req, res)=>{
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('./error/500.ejs')
        
    }
})

/*
stories which are public
title, body, user.name, user.image

*/
router.get('/', ensureAuth,async (req,res)=>{
    try {
        const retrievedStories = await Story.find(
            {status: "public"}
            ).lean().populate('user').select({body: 0}).exec()

        return res.json(retrievedStories)
        
    } catch (error) {
        console.log(error)
    }

    res.render('./stories/index.ejs')
})


module.exports = router