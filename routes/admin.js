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
        let storyQueries = users.map((el) =>
            Story.find({ user: el._id }).lean().exec()
        )
        const storyList = await Promise.all(storyQueries)
        //add two properties on each author totalStories and totalLikes
        for (let i = 0; i < users.length; i++) {
            users[i].totalStories = storyList[i].length
            users[i].totalLikes = storyList[i]
                .map((el) => el.likes)
                .reduce((acc, cur) => acc + cur, 0)
        }
        let usersDateFormatted = []
        for (let user of users) {
            const formattedDate = moment(user.createdAt).format(
                "YYYY-MM-DD"
            )
            const shortUser = {
                _id: user._id,
                Email: user.email,
                "First Name": user.firstName,
                "Last Name": user.lastName,
                Wrote: user.totalStories,
                "Liked By": user.totalLikes,
                Liked: user.liked.length,
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
