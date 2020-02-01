const nexmo = require("../loaders/initializeSMS").nexmo;

function sendSms(to, text,from="CricKhata"){
    if(!nexmo){
        return false;
    }
    nexmo.message.sendSms(from, to, text);
    return true;
}

module.exports = {
    sendSms:sendSms
}
 
