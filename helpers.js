const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone") // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const User = require("./models/User")
const Story = require("./models/Story")

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

// creating an array of promises to get the number of likes for each story
// and adding "likes" to each story
// const countLikesForAllStories = async (retrievedStories) => {
//     const likePromises = retrievedStories.map((el) => {
//         return User.find({ liked: el._id }).countDocuments()
//     })

//     const likesArray = await Promise.all(likePromises)
//     for (let i = 0; i < retrievedStories.length; i++) {
//         retrievedStories[i].likes = likesArray[i]
//     }
//     return retrievedStories
// }

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
        // console.log(`[${st+1} to ${last}]`)
        results.push([st + 1, last])
        i++
    }
    if (last !== N) results.push([last + 1, N])
    return results
}

//Middleware to retrieve stories and likes

const getPublicStories = async (req, res, next) => {
    const sortby = req.query.sortby || "Recent"
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
    const perPage = 6
    req.paginationData = paginate(numStories, perPage)
    req.numStories = numStories
    req.pageNumber = pageNumber
    sortOption = sortby === "Oldest" ? 1 : -1
    let retrievedStories = []
    let dbquery = {}
    if (sortby === "YouLiked") {
        dbquery = Story.find({ status: "public", _id: { $in: ids } })
    } else {
        dbquery = Story.find({ status: "public" })
    }

    if (pageNumber !== "all") {
        dbquery.skip(pageNumber * perPage - perPage).limit(perPage)
    }
    retrievedStories = await dbquery
        .sort({ updatedAt: sortOption })
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

    if (sortby === "MostLikes") {
        retrievedStories.sort((a, b) => {
            return a.likes > b.likes ? -1 : 1
        })
    }
    if (sortby === "LeastLikes") {
        retrievedStories.sort((a, b) => {
            return a.likes > b.likes ? 1 : -1
        })
    }
    req.retrievedStories = retrievedStories
    req.sortby = sortby
    next()
}

const removeLikes = async (userid, storyID) => {
    const updatedUser = await User.findOneAndUpdate(
        { _id: userid },
        { $pull: { liked: storyID } },
        { new: true }
    )
    const updatedStory = await Story.findOneAndUpdate(
        { _id: storyID },
        { $pull: { likedBy: userid }, $inc: { likes: -1 } }, //the update should be contained in one object
        { new: true }
    )
    return { updatedUser, updatedStory }
}

const addLikes = async (userid, storyID) => {
    const updatedUser = await User.findOneAndUpdate(
        //adding a like
        { _id: userid },
        { $addToSet: { liked: storyID } },
        { new: true }
    )
    const updatedStory = await Story.findOneAndUpdate(
        { _id: storyID },
        { $addToSet: { likedBy: userid }, $inc: { likes: +1 } },
        { new: true }
    )
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
