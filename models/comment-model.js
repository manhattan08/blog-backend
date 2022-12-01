const {Schema, model} = require('mongoose');

const CommentSchema = new Schema({
  body:{type:String,require:true,minLength:3},
  username:{type:Schema.Types.ObjectId,ref:"User"},
  avatarUrl:{type:Schema.Types.ObjectId,ref:"User"},
  idPost:String
},{
  timestamps:true,
})

module.exports = model('Comment',CommentSchema);