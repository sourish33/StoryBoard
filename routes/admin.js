const express = require("express")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")
const bcrypt = require('bcrypt')
const Story = require("../models/Story")
const User = require("../models/User")


router.get("/admin-dashboard", (req, res) => {
    res.render("./admin/admin-dashboard.ejs")
})

module.exports = router