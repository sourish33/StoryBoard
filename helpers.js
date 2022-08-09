const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone") // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const User = require("./models/User")
const Story = require("./models/Story")
const SEARCH_OPTIONS = ["Recent", "YouLiked", "MostLikes", "LeastLikes"]
const perPage = 6

const formatTime = (time) => {
    return dayjs(time).format("MMM D, YYYY h:mm A")
}

const formatTimeShort = (time) => {
    return dayjs(time).format("	M/D/YY, h:mm A")
}
const formatTimeDateOnly = (time) => {
    return dayjs(time).format("MMMM D, YYYY")
}

const processText = (str, chars = 200) => {
    if (str.length < chars || str.length === 0) {
        return str
    }
    str = str.replace(/<[^>]*>?/gm, "")
    str = str.slice(0, chars)
    const lastSpaceIndex = str.lastIndexOf(" ")
    str = lastSpaceIndex > 0 ? str.slice(0, lastSpaceIndex) + "..." : str
    return str
}


function paginate(N, perPage) {
    let numPages = Math.floor(N / perPage)
    let st = 0
    let last = 0
    let i = 0
    let results = []

    let numFullPages = Math.floor(N / perPage)
    while (last < numFullPages * perPage) {
        st = i * perPage
        last = st + perPage
        results.push([st + 1, last])
        i++
    }
    if (last !== N) results.push([last + 1, N])
    return results
}

//Middleware to retrieve public stories and likes

const getPublicStories = async (req, res, next) => {
    const sortby = req.query.sortby || "Recent"
    if (!SEARCH_OPTIONS.includes(sortby)) {
        return res.render("error/500", { error: `Invalid search option ${sortby}` })
    }

    const ids = req.user.liked
    let numStories = 0
    if (sortby === "YouLiked") {
        numStories = await Story.find({
            status: "public",
            _id: { $in: ids },
        }).countDocuments()
    } else {
        numStories = await Story.find({ status: "public" }).countDocuments()
    }
    const pageNumber = req.query.pageNumber || 1
    if (!Number.isInteger(+pageNumber) || +pageNumber <1){
        return res.render("error/500", { error: `Invalid page number ${pageNumber}: must be an integer greater than 1` })
    }


    let paginationData = paginate(numStories, perPage)
    if (paginationData && paginationData.length<pageNumber){
        return res.render("error/500", { error: `Invalid page number ${pageNumber}: cannot be greater than the number of pages ${paginationData.length}` })
    }
    req.paginationData = paginationData
    req.numStories = numStories
    req.pageNumber = pageNumber
    let sortOptionChrono = sortby === "Oldest" ? 1 : -1
    let retrievedStories = []
    let dbquery = {}
    if (sortby === "YouLiked") {
        dbquery = Story.find({ status: "public", _id: { $in: ids } })
    } else {
        dbquery = Story.find({ status: "public" })
    }

    if (sortby === "MostLikes"){
        dbquery.sort({likes: -1, updatedAt: sortOptionChrono })
    }
    if (sortby === "LeastLikes"){
        dbquery.sort({likes: 1, updatedAt: sortOptionChrono })
    }

    dbquery.sort({ updatedAt: sortOptionChrono })

    if (pageNumber !== "all") {
        dbquery.skip(pageNumber * perPage - perPage).limit(perPage)
    }
    retrievedStories = await dbquery
        .lean()
        .populate("user")
        .exec()
    retrievedStories.forEach((story) => {
        story.body = processText(story.body, 200)
        story.shortTitle = processText(story.title, 25)
        story.editIcon = story.user._id.equals(req.user._id) ? "" : "hidden"
        story.storyID = story._id
        story.updatedAt = formatTime(story.updatedAt)
    })
    req.retrievedStories = retrievedStories
    req.sortby = sortby
    next()
}

const removeLikes = async (userid, storyID) => {
    const promises = [
        User.findOneAndUpdate(
            { _id: userid },
            { $pull: { liked: storyID } },
            { new: true,  timestamps: false  }//all options must be in the same object
        ),
        Story.findOneAndUpdate(
            { _id: storyID },
            { $pull: { likedBy: userid }, $inc: { likes: -1 } }, //the update should be contained in one object
            { new: true,  timestamps: false  }
        ),
    ]
    const [updatedUser, updatedStory] = await Promise.all(promises)
    return { updatedUser, updatedStory }
}

const removeAllLikes = async (userid) =>{
    const storyFilter = {likedBy: {$in: [userid]}}
    const storyUpdate = { $pull: { likedBy: userid }, $inc: { likes: -1 } }
    const storyOptions = { new: true,  timestamps: false  }
    const promises = [
        User.findByIdAndUpdate(userid, { $set: { liked: [] } }),
        Story.updateMany(storyFilter, storyUpdate, storyOptions)
    ]
    const [updatedUser, updatedStories] = await Promise.all(promises)
    return { updatedUser, updatedStories }
}

const addLikes = async (userid, storyID) => {
    const promises = [
        User.findOneAndUpdate(//adding a like
            { _id: userid },
            { $addToSet: { liked: storyID } },
            { new: true,  timestamps: false  }
        ),
        Story.findOneAndUpdate(
            { _id: storyID },
            { $addToSet: { likedBy: userid }, $inc: { likes: +1 } },
            { new: true, timestamps: false  }
        ),
    ]
    const [updatedUser, updatedStory] = await Promise.all(promises)
    return { updatedUser, updatedStory }
}

module.exports.formatTime = formatTime
module.exports.formatTimeShort = formatTimeShort
module.exports.formatTimeDateOnly = formatTimeDateOnly
module.exports.processText = processText
module.exports.paginate = paginate
module.exports.getPublicStories = getPublicStories
module.exports.removeLikes = removeLikes
module.exports.addLikes = addLikes
module.exports.removeAllLikes = removeAllLikes
