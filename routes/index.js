const express = require('express')
const router = express.Router()
// const passport = require('passport')


//  @desc landing page
// @route GET /

router.get(['/', '/login'], (req,res)=>{
    res.render('login.ejs', {title: "Login"})
})

// @desc dashboard
//@route  GET /auth/google/callback
router.get('/dashboard', (req, res) => {
    res.render('dashboard.ejs', {adj: "puta madre", title: "Dashboard"})
})



module.exports = router