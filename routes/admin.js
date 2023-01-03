const express = require("express")
const router = express.Router()
const { ensureAuthAdmin } = require("../middleware/auth")
const bcrypt = require('bcrypt')
const Story = require("../models/Story")
const User = require("../models/User")
const moment = require('moment');


router.get("/dashboard", ensureAuthAdmin, (req, res) => {
    res.status(200).render("./admin/admin-dashboard.ejs", {user: req.user})
})

router.get("/users", ensureAuthAdmin, async (req, res) =>{
    try {
        const users = await User.find({}).lean().exec()
        //can't mutate users for some reason so creating a new array usersDateFormatted
        let usersDateFormatted = []
        for (let user of users) {
            const formattedDate = moment(user.createdAt).format('YYYY-MM-DD');
            const shortUser = {_id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, liked: user.liked.length, joinDate: formattedDate}
            usersDateFormatted.push(shortUser)
        }
        res.status(200).render('./admin/admin-users.ejs', {users: usersDateFormatted})
    } catch (error) {
        console.log(error)
        res.status(500).render("./error/500.ejs", { error })
    }
})


router.get("/stories", ensureAuthAdmin, async (req, res) =>{
    try {
        const stories = await Story.find({})
        console.log(stories.length)
        res.status(200).render('./admin/admin-users.ejs')

    } catch (error) {
        console.log(error)
        res.status(500).render("./error/500.ejs", { error })
    }
})

module.exports = router