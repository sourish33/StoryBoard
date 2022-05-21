const dayjs = require("dayjs");


const formatTime = (time) =>{
return dayjs(time).format('MMM D, YYYY h:mm A')
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
module.exports.processText=processText