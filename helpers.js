const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)


const formatTime = (time) =>{
return dayjs(time).format('MMM D, YYYY h:mm A')
}

const formatTimeShort = (time) =>{
    return dayjs(time).format('	M/D/YY, h:mm A')
    }

const processText = (str, chars=200) =>{
    if (str.length<chars || str.length===0){
        return str
    }
    str = str.replace(/<[^>]*>?/gm, '');
    str = str.slice(0, chars)
    const lastSpaceIndex = str.lastIndexOf(" ")
    str=lastSpaceIndex>0 ? str.slice(0, lastSpaceIndex)+"..." : str
    return str
}

module.exports.formatTime = formatTime
module.exports.formatTimeShort = formatTimeShort
module.exports.processText=processText