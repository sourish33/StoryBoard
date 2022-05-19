const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story= require('../models/Story')
const User = require('../models/User')


//  @desc Show Add page
// @route GET /


const processStory = (story) =>{
    let str = story.body
    str = str.replace(/<[^>]*>?/gm, '');
    if (str.length>200 && str.length>0){
        str = str.slice(0, 200)
    }
    story.body = str
    return story
}

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
            ).lean().populate('user').exec()
        retrievedStories.forEach(story => story = processStory(story))
        // return res.json(retrievedStories)
        res.render('./stories/index.ejs', {retrievedStories: retrievedStories})
        
    } catch (error) {
        console.log(error)
    }

    
})


module.exports = router