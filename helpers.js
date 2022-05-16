const dayjs = require("dayjs");


const formatTime = (time) =>{
return dayjs(time).format('MMM D, YYYY h:mm A')
}

module.exports.formatTime = formatTime