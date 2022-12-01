const CommentService = require('../service/comment-service')
const CommentModel = require("../models/comment-model");
const ApiError = require("../exceptions/api-error");


class CommentCotroller{
  async create(req,res,next){
    try{
      const { body } = req.body;
      const commentData = await CommentService.create(req.user.id,body,req.params.id)
      return res.json(commentData)
    } catch (e) {
      next(e)
    }
  }
  async getCommentsByPost(req,res,next){
    try{
      const comments = await CommentService.getCommentsByPost(req.params.id);
      return res.json(comments)
    } catch (e) {
      next(e)
    }
  }
  async getLastComments(req,res,next){
    try{
      const comments = await CommentService.getLastComments();
      return res.json(comments)
    } catch (e) {
      next(e)
    }
  }
  async deleteComment(req,res,next){
    try{
      CommentModel.findOneAndRemove(
        {_id:req.params.id},
        (err,doc) => {
          if(err){
            return next(ApiError.BadRequest("Failed to delete comment"))
          }
          if(!doc){
            return next(ApiError.BadRequest("Comment not found"))
          }
          return res.json({success:true});
        }
      )
    } catch (e) {
      res.json(e)
    }
  }
}

module.exports = new CommentCotroller()