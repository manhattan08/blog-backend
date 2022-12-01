const {Schema, model} = require('mongoose');

const PostSchema = new Schema({
  title:{type:String,require:true},
  text:{type:String,require:true},
  tags:{type:Array,default: []},
  viewsCount:{type:Number,default: 0},
  commentsCount:{type:Number,default:0},
  user:String,
  imageUrl:String,
  username:{ type:Schema.Types.ObjectId,ref:"User"},
  avatarUrl:{type:Schema.Types.ObjectId,ref:"User"}
},{
  timestamps:true,
})

module.exports = model('Post',PostSchema);