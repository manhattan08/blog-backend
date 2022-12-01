const PostService = require('../service/post-service')
const PostModel = require("../models/post-model");
const ApiError = require("../exceptions/api-error");

class PostController{
  async create(req,res,next){
    try{
      const {title,text,imageUrl,tags} = req.body;
      const postData = await PostService.create(title,text,imageUrl,req.user.avatarUrl,req.user.username,tags,req.user.id)
      return res.json(postData);
    } catch (e) {
      next(e)
    }
  }
  async getAll(req,res,next){
    try{
      const posts = await PostService.getAll(req.body.num);
      return res.json(posts)
    } catch (e) {
      next(e)
    }
  }
  async getOne(req,res,next){
    try{
      PostModel.findOneAndUpdate(
        {_id:req.params.id},
        {$inc: {viewsCount:1}},
        {returnDocument:"after"},
        (err,doc)=>{
          if(err){
            return next(ApiError.BadRequest("Failed to return post"))
          }
          if(!doc){
            return next(ApiError.BadRequest("Post not found"))
          }
          return res.json(doc)
        }).populate("username","username").populate("avatarUrl","avatarUrl")
    } catch (e) {
      next(e)
    }
  }
  async delete(req,res,next){
    try{
      PostModel.findOneAndRemove(
        {_id:req.params.id},
        (err,doc) => {
          if(err){
           return next(ApiError.BadRequest("Failed to delete post"))
          }
          if(!doc){
            return next(ApiError.BadRequest("Post not found"))
          }
          return res.json({success:true});
        }
      )
    } catch (e) {
      res.json(e)
    }
  }
  async update(req,res,next){
    try{
      const {title,text,imageUrl,tags} = req.body;
      const updated = await PostService.update(req.user.id,req.params.id,title,text,imageUrl,tags)
      return res.json(updated)
    } catch (e) {
      next(e);
    }
  }
  async getLastTags(req,res,next){
    try{
      const posts = await PostService.getTags();
      return res.json(posts);
    } catch (e) {
      next(e);
    }
  }
  async getPostsWithTag(req,res,next){
    try {
      const posts = await PostService.getPostsWithTag(req.params.name)
      return res.json(posts)
    } catch (e) {
      next(e)
    }
  }
  async decComment(req,res,next){
    try{
      const dec = await PostService.decComment(req.params.id)
      return res.json(dec)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new PostController();