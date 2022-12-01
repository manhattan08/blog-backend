const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");


module.exports = function(req,res,next){
    if(req.method === "OPTIONS"){
      next()
    }
    try{
      const accessToken = req.headers.authorization.split(" ")[1];
      if(!accessToken) {
        return next(ApiError.UnauthorizedError())
      }
      const decoded = tokenService.validateAccessToken(accessToken);
      if(decoded.role !== 'ADMIN') {
        return next(ApiError.BadRequest("No access!"))
      }
      req.user=decoded;
      next();
    } catch (e) {
      return next(ApiError.UnauthorizedError())
    }
}
