const express = require('express');
const router = express.Router({mergeParams: true});
const app = express();
const userService = require("../services/UserService");
const responseBaseClass = require("../BaseClasses/GenericResponse");

router.get("/",async function(req,res){
    try{
        let result = await userService.getUserList(req,res);
        let gr = new responseBaseClass.GenericResponse(`${result.status ? "success" : "error"}`,result.res);
        res.send(gr.response())
    }
    catch(err){
        let gr = new responseBaseClass.GenericResponse("error",err.toString())
        res.send(gr.response())
    }
})

router.get("/:userId",function(req,res){

})

router.post("/create",async function(req,res){
    try{
        let result = await userService.createUser(req,res);
        let gr = new responseBaseClass.GenericResponse(`${result.status ? "success" : "error"}`,result.res);
        res.send(gr.response())
    }
    catch(err){
        let gr = new responseBaseClass.GenericResponse("error",err.toString())
        res.send(gr.response())
    }
})

router.delete("/:userId",function(req,res){

})

router.put("/:userId",function(req,res){

})

router.post("/send/otp",async function(req,res){
    try{
        let result = await userService.sendOtp(req,res);
        let gr = new responseBaseClass.GenericResponse(`${result.status ? "success" : "error"}`,result.res);
        res.send(gr.response())
    }
    catch(err){
        let gr = new responseBaseClass.GenericResponse("error",err.toString())
        res.send(gr.response())
    }
})

module.exports = router;