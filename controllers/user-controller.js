const {validationResult} = require("express-validator");
const ApiError = require("../exceptions/api-error");
const UserService = require("../service/user-service")

class UserController {
  async registration(req,res,next){
    try{
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        return next(ApiError.BadRequest("Validation error!", errors.array()))
      }
      const {email,password,username,avatarUrl,role} = req.body;
      const userData = await UserService.registration(email,password,username,avatarUrl,role);
      res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly: true})
      return res.json(userData);
    } catch (e){
      next(e);
    }
  }
  async login(req,res,next) {
    try{
      const {email,password} = req.body;
      const userData = await UserService.login(email,password);
      res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly: true})
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req,res,next){
    try{
      const token = await UserService.logout(res._id);
      res.clearCookie("refreshToken");
      res.status(202).json(token);
    } catch (e) {
      next(e);
    }
  }
  async activate(req,res,next) {
    try{
      const activationLink = req.params.link;
      await UserService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL)
    } catch(e){
      next(e);
    }
  }
  async refresh(req,res,next) {
    try{
      const {refreshToken} = req.cookies;
      const userData = await UserService.refresh(refreshToken)
      res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly: true})
      return res.json(userData);
    } catch(e){
      next(e);
    }
  }
  async getUser(req,res,next){
    try{
      const user = await UserService.getUser(req.user.id);
      res.json(user);
    }catch (e) {
      next(e);
    }
  }
  async getUsers(req,res,next){
    try{
      const users = await UserService.getUsers();
      res.json(users)
    } catch (e) {
      next(e)
    }
  }
  async userUpdate(req,res,next){
    try{
      const {avatarUrl,username,email,oldPassword,newPassword} = req.body;
      const userData = await UserService.userUpdate(req.user.id,avatarUrl,username,email,oldPassword,newPassword);
      res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly: true})
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async userBan(req,res,next){
    try{
      const id = req.params.id;
      const {isBan,reasonBan} = req.body
      const user = UserService.userBan(id,isBan,reasonBan)
      return res.json(user);
    } catch (e) {
      next(e)
    }
  }
  async setModer(req,res,next) {
    try{
      const id = req.params.id;
      console.log(req.body)
      const { role }= req.body;
      const user = UserService.setModer(id,role);
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController();