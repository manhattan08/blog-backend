const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
  generateTokens(payload){
    const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
      expiresIn:"2h"
    })
    const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
      expiresIn:"30d"
    })
    return {
      accessToken,
      refreshToken
    }
  }
  async saveToken(userId,refreshToken){
    const tokenData = await tokenModel.findOne({user:userId});
    if(tokenData){
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token =  await tokenModel.create({user:userId,refreshToken})
    return token;
  }
  async removeToken(_id){
    const tokenData = await tokenModel.deleteOne({user:_id});
    return tokenData;
  }
  validateAccessToken(token){
    try {
      const userDate = jwt.verify(token,process.env.JWT_ACCESS_SECRET);
      return userDate;
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(token){
    try {
      const userDate = jwt.verify(token,process.env.JWT_REFRESH_SECRET);
      return userDate;
    } catch (e) {
      return null;
    }
  }
  async findToken(refreshToken){
    const tokenData = await tokenModel.findOne({refreshToken});
    return tokenData;
  }
}

module.exports = new TokenService();