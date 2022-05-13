const express = require('express')
const router = express.Router()


//  @desc Login/Landing page
// @route GET /
router.get('/', (req, res)=>{
    res.render('main.ejs', {name: "Sourish Dutta", title: "Home"})
})

// @desc Dashboard
//@route  GET /dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard.ejs', {adj: "fucking", title: "Dashboard"})
})

router.get('/login', (req, res) => {
    res.render('login.ejs', {title: "Login"})
})

module.exports = router