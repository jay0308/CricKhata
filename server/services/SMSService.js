const nexmo = require("../loaders/initializeSMS").nexmo;
const ServiceResponse = require("../BaseClasses/ServiceResponse").serviceResponse;
const appConstants = require("../config/constants").appConstants;

function sendSms(to, text,from="CricKhata"){
    if(!nexmo){        
        let sr = new ServiceResponse(false,appConstants.SMS_SERVICE_NOT_AVAILABLE);
        return sr.getServiceResponse();  
    }
    nexmo.message.sendSms(from, `91${to}`, text);
    let sr = new ServiceResponse(true,appConstants.SMS_SENT);
    return sr.getServiceResponse();  
}

module.exports = {
    sendSms:sendSms
}
 
