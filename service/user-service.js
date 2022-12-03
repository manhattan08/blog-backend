const UserModel = require("../models/user-model")
const ApiError = require("../exceptions/api-error");
const mailService = require("./mail-service");
const bcrypt = require("bcrypt");
const uuid = require('uuid');
const UserDto = require("../dtos/user-dto");
const tokenService = require('./token-service');


class UserService {
  async registration (email,password,username,avatarUrl,role){
    const candidate  = await UserModel.findOne({email});
    if(candidate) {
      throw ApiError.emailExisted()
    }
    const hashPassword = bcrypt.hashSync(password,10);
    const activationLink = uuid.v4();
    const user = await UserModel.create({email,password:hashPassword,username,avatarUrl,activationLink,role});
    await mailService.sendActivationMail(email,`${process.env.API_URL}/auth/activate/${activationLink}`)

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto})
    await tokenService.saveToken(userDto.id,tokens.refreshToken);
    return {...tokens,user:userDto}
  }
  async login(email,password){
    const user = await UserModel.findOne({email});
    if(user.ban.isBan){
      throw ApiError.BannedUser("User Banned")
    }
    if(!user) {
      throw ApiError.BadRequest('User with this email didnt found!');
    }
    const isPassEqual = bcrypt.compareSync(password,user.password);
    if(!isPassEqual){
      throw ApiError.BadRequest("Incorrect password or Email!")
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto})

    await tokenService.saveToken(userDto.id,tokens.refreshToken);
    return {...tokens, user: userDto}
  }
  async logout(_id){
    const token = await tokenService.removeToken(_id)
    return token;
  }
  async activate(activationLink){
    const user = await UserModel.findOne({activationLink})
    if(!user){
      throw ApiError.BadRequest('Incorrect link activation!');
    }
    user.isActivated = true;
    user.save();
  }
  async refresh(refreshToken){
    if(!refreshToken){
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if(!userData || !tokenFromDB){
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto})

    await tokenService.saveToken(userDto.id,tokens.refreshToken);
    return {...tokens, user: userDto}
  }
  async getUser(id){
    const user = await UserModel.findById(id);
    if(!user){
      throw ApiError.UnauthorizedError();
    }
    const {password,...userData} = user._doc;
    return userData;
  }
  async getUsers(){
    const users = await UserModel.find({role:{$ne:"ADMIN"}},{password:0,isActivated:0,activationLink:0,createdAt:0,updatedAt:0});
    if(!users){
      throw ApiError.UnauthorizedError();
    }
    return users;
  }
  async userUpdate(id,avatarUrl,username,email,oldPassword,newPassword){
    const data = await UserModel.findById(id);
    if(email){
      const candidate  = await UserModel.findOne({email});
      if(candidate){
        throw ApiError.BadRequest(`This email ${email} has already exists!`)
      }
      const activationLink = uuid.v4();
      data.isActivated = false;
      data.activationLink = activationLink;
      data.save()
      await mailService.sendActivationMail(email,`${process.env.API_URL}/auth/activate/${activationLink}`)
    }
    if((oldPassword && !newPassword) || (!oldPassword && newPassword)){
      throw ApiError.BadRequest("Enter two passwords!")
    }
    if(oldPassword && !bcrypt.compareSync(oldPassword,data.password)){
      throw ApiError.BadRequest("Incorrect old password!")
    }
      const user = await UserModel.findOneAndUpdate({ _id:id },
      {
        avatarUrl: avatarUrl ? avatarUrl : data.avatarUrl,
        username: username ? username : data.username,
        email: email ? email : data.email,
        password:  oldPassword ? bcrypt.hashSync(newPassword,10) : data.password
      },{returnDocument:"after"})
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto})
    await tokenService.saveToken(userDto.id,tokens.refreshToken);
    return {...tokens,user:userDto}
  }
  async userBan(id,isBan,reasonBan){
   await UserModel.findOneAndUpdate({_id:id},{
      ban:{
        isBan: isBan,
        reasonBan: isBan ? reasonBan: ""
      }
    })
    return { success:true };
  }
  async setModer(id,king){
    await UserModel.findOneAndUpdate({_id:id},{
      role: king
    })
    return { success:true };
  }
}

module.exports = new UserService();