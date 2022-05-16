const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const Story= require('../models/Story')


//  @desc Show Add page
// @route GET /


router.get('/add', ensureAuth,(req,res)=>{
    res.render('./partials/add.ejs')
})


module.exports = router