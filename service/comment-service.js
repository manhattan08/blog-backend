const CommentModel = require("../models/comment-model");
const PostModel = require("../models/post-model");

class CommentService {
  async create(id,body,idPost){
    const comment = await CommentModel.create({
      username: id,
      avatarUrl: id,
      body,
      idPost
    })
    await PostModel.findByIdAndUpdate(idPost,{$inc:{commentsCount:1}});
    return comment
  }
  async getCommentsByPost(id){
    const comments = await CommentModel.find({idPost:id}).populate("username","username").populate("avatarUrl","avatarUrl");
    return comments;
  }
  async getLastComments(){
    const comments = await CommentModel.find().populate("username","username").populate("avatarUrl","avatarUrl").limit(5).sort({"createdAt":-1}).exec();
    return comments;
  }
}

module.exports = new CommentService()