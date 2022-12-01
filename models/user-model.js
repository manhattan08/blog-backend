const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
  username:{type:String,unique:true,require:true},
  email:{type:String,unique:true,require:true},
  password:{type:String,require:true},
  avatarUrl:String,
  isActivated:{type:Boolean,default:false},
  activationLink: {type:String},
  role:{type:String,default:"USER"},
  ban:{
    isBan:{type:Boolean,default:false},
    reasonBan:{type:String,default:""}
  }
},{
  timestamps:true,
})

module.exports = model('User',UserSchema);