const dayjs = require("dayjs")
const utc = require("dayjs/plugin/utc")
const timezone = require("dayjs/plugin/timezone") // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const User = require("./models/User")

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
const countLikesForAllStories = async (retrievedStories) => {
    const likePromises = retrievedStories.map((el) => {
        return User.find({ liked: el._id }).countDocuments()
    })

    const likesArray = await Promise.all(likePromises)
    for (let i = 0; i < retrievedStories.length; i++) {
        retrievedStories[i].likes = likesArray[i]
    }
    return retrievedStories
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
        // console.log(`[${st+1} to ${last}]`)
        results.push([st + 1, last])
        i++
    }
    if (last !== N) results.push([last + 1, N])
    return results
}

module.exports.formatTime = formatTime
module.exports.formatTimeShort = formatTimeShort
module.exports.formatTimeDateOnly = formatTimeDateOnly
module.exports.processText = processText
module.exports.countLikesForAllStories = countLikesForAllStories
module.exports.paginate = paginate
