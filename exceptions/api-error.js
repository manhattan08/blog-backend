module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status,message,errors=[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static UnauthorizedError(message){
    return new ApiError(401,'User not authorized!');
  }
  static BadRequest(message,errors=[]){
    return new ApiError(400,message,errors);
  }
  static BannedUser(){
    return new ApiError(409,{})
  }
  static emailExisted(){
    return new ApiError(410,{})
  }
}