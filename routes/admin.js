const express = require("express")
const router = express.Router()
const { ensureAuthAdmin } = require("../middleware/auth")
const bcrypt = require("bcrypt")
const Story = require("../models/Story")
const User = require("../models/User")
const moment = require("moment")
const { promiseImpl } = require("ejs")

router.get("/dashboard", ensureAuthAdmin, (req, res) => {
    res.status(200).render("./admin/admin-dashboard.ejs", { user: req.user })
})

router.get("/users", ensureAuthAdmin, async (req, res) => {
    try {
        const users = await User.find({}).lean().exec()
        //create querries for getting number of stories for each user
        let storyQueries = []
        for (let user of users) {
            let storiesQuery = Story.find({ user: user._id }).lean().exec()
            storyQueries.push(storiesQuery)
        }
        const storyList = await Promise.all(storyQueries)
        const storyNums = storyList.map((el) => el.length)
        // console.log(storyNums)
        //can't mutate users for some reason so creating a new array usersDateFormatted
        let usersDateFormatted = []
        for (let i = 0; i < users.length; i++) {
            const formattedDate = moment(users[i].createdAt).format(
                "YYYY-MM-DD"
            )
            const shortUser = {
                _id: users[i]._id,
                Email: users[i].email,
                "First Name": users[i].firstName,
                "Last Name": users[i].lastName,
                Wrote: storyNums[i],
                Liked: users[i].liked.length,
                Joined: formattedDate,
            }
            usersDateFormatted.push(shortUser)
        }
        res.status(200).render("./admin/admin-users.ejs", {
            users: usersDateFormatted,
        })
    } catch (error) {
        console.log(error)
        res.status(500).render("./error/500.ejs", { error })
    }
})

router.get("/stories", ensureAuthAdmin, async (req, res) => {
    try {
        const stories = await Story.find({})
        console.log(stories.length)
        res.status(200).render("./admin/admin-users.ejs")
    } catch (error) {
        console.log(error)
        res.status(500).render("./error/500.ejs", { error })
    }
})

module.exports = router
