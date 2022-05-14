const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')


//  @desc landing page
// @route GET /

router.get(['/', '/login'], ensureGuest,(req,res)=>{
    res.render('login.ejs', {title: "Login"})
})

// @desc dashboard
//@route  GET /auth/google/callback
router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard.ejs')
})



module.exports = router