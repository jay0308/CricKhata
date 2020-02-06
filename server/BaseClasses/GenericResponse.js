class GenericResponse{
    constructor(responseType,res){
        this.responseType = responseType;
        this.res = res;
    }

    response(){
        let results = {
            results:{
                exception:false, 
            },
            message:""
        }
        if(this.responseType === "success" || this.responseType === true){
            results.results.statusCode = 200;
            results.results.body = this.res
        }else{
            results.results.exception = true;
            results.statusCode = 500;
            results.message = this.res
        }
        return results;
    }
}

module.exports = {
    GenericResponse:GenericResponse
}