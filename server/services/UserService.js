const dbVars = require("../loaders/dbInitializer").dbVars;
const ServiceResponse = require("../BaseClasses/ServiceResponse").serviceResponse;
const appConstants = require("../config/constants").appConstants;
const SMSService = require("./SMSService");

const getUserList = async (req, res) => {
    try {
        const mongoDb = dbVars.db;
        let result = await mongoDb.collection("users").find({}).toArray();
        console.log("User List", result)
        let sr = new ServiceResponse(true, result);
        return sr.getServiceResponse();
    } catch (err) {
        console.log("Err", err);
        let sr = new ServiceResponse(false, err.toString());
        return sr.getServiceResponse();
    }
}
const createUser = async (req, res) => {
    try {
        // console.log("DBBVARS",dbVars.client.db().users())
        const mongoDb = dbVars.db;
        let userData = req.body;
        userData.createDate = new Date();
        userData.updateDate = new Date();
        let isValidate = await validateUserDetails(userData, "users");
        if (isValidate.status) {
            let result = await mongoDb.collection("users").insertOne(userData);
            if (result && result.insertedCount > 0) {
                let sr = new ServiceResponse(true, appConstants.USER_INSERTED);
                return sr.getServiceResponse();
            }
            let sr = new ServiceResponse(false, appConstants.USER_NOT_CREATED);
            return sr.getServiceResponse();
        } else {
            return isValidate;
        }
    } catch (err) {
        console.log("Err", err);
        let sr = new ServiceResponse(false, err.toString());
        return sr.getServiceResponse();
    }
    // let isValidate = await validateUserDetails(userData);

}

const validateUserDetails = async (userData, collectionName) => {
    const mongoDb = dbVars.db;
    try {
        if (userData.contactNo && userData.contactNo.toString().length === 10) {
            let result = await mongoDb.collection(collectionName).find({ contactNo: userData.contactNo }).count();
            if (result > 0) {
                let sr = new ServiceResponse(false, appConstants.USER_ALREADY_EXIST);
                return sr.getServiceResponse();
            }
            let sr = new ServiceResponse(true, null);
            return sr.getServiceResponse();
        } else {
            let sr = new ServiceResponse(false, appConstants.USER_NOT_VALIDATED);
            return sr.getServiceResponse();
        }
    }
    catch (err) {
        console.log("Err", err);
        let sr = new ServiceResponse(false, err.toString());
        return sr.getServiceResponse();
    }
}

const isOlderDate = (date,hr) => {
    let now = new Date().getMilliseconds();
    let _date = new Date(date).getMilliseconds();
    let milliSec = hr*60*60;
    let remainMilliSec = now - milliSec;
    if(remainMilliSec >= _date){
        return true
    }else{
        return false
    }
}

const sendOtp = async (req, res) => {
    try {
        let reqData = req.body;
        reqData.createDate = new Date();
        reqData.updateDate = new Date();
        reqData.otp = generateOtp();
        reqData.count = 0;
        let latestReq = await getLatestOtpReq(reqData);
        let otpRecord ;
        if(latestReq.status){
            if(isOlderDate(latestReq.res.updateDate)){
               otpRecord = await enterOtpRecord(reqData)
            }else{
                reqData.count = latestReq.res.count + 1;
                if(latestReq.res.count <= 5){
                    otpRecord = await updateOtp(reqData,latestReq.res._id)
                }else{
                    let sr = new ServiceResponse(false, appConstants.MAX_OTP_REACH);
                    return sr.getServiceResponse();
                }
            }
        }else{
            otpRecord = await enterOtpRecord(reqData);
        }
        if(otpRecord.status)
            return SMSService.sendSms(reqData.contactNo,`CRICKHATA, OTP - ${reqData.otp}   `);
        return otpRecord;
    } catch (err) {
        console.log("Err", err);
        let sr = new ServiceResponse(false, err.toString());
        return sr.getServiceResponse();
    }
}

const enterOtpRecord = async (reqData) => {
    const mongoDb = dbVars.db;
    try{        
        let result = await mongoDb.collection("userOtp").insertOne(reqData);
        let sr = new ServiceResponse(true, null);
        return sr.getServiceResponse();
    }catch(err){
        console.log("Err", err);
        let sr = new ServiceResponse(false, err.toString());
        return sr.getServiceResponse();
    }
}

const generateOtp = () => {
    return Math.floor((Math.random() * 10000) + 999);
}

const updateOtp = async (reqData,id) => {
    try{
        const mongoDb = dbVars.db;
        let existNo = await mongoDb.collection("userOtp").updateOne({ _id: id },{ $set: reqData});
        console.log("EXIST NO",existNo);let sr = new ServiceResponse(true, "updated Otp");
        return sr.getServiceResponse();
    }catch(err){
        console.log("Err", err);
        let sr = new ServiceResponse(false, err.toString());
        return sr.getServiceResponse();
    }
}

const getLatestOtpReq = async (reqData) => {
    try{
        const mongoDb = dbVars.db;
        let latest = await mongoDb.collection("userOtp").find({contactNo:reqData.contactNo}).sort({"updateDate": -1}).limit(1).toArray();
        if(latest && latest.length > 0){
            let sr = new ServiceResponse(true, latest[0]);
            return sr.getServiceResponse();
        }
        let sr = new ServiceResponse(false, null);
        return sr.getServiceResponse();
    }catch(err){
        console.log("Err", err);
        let sr = new ServiceResponse(false, err.toString);
        return sr.getServiceResponse();
    }
}

module.exports = {
    createUser: createUser,
    getUserList: getUserList,
    sendOtp: sendOtp
}