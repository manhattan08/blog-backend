const PostModel = require("../models/post-model")

class PostService {
  async create(title,text,imageUrl,avatarUrl,username,tags,id){
    const post = await PostModel.create({
      title,
      text,
      imageUrl,
      avatarUrl:id,
      username:id,
      tags: tags.split(","),
      user: id
    })
    return post;
  }
  async getAll(num){
    if(num === 1){
      const post1 = await PostModel.find().populate("username","username").populate("avatarUrl","avatarUrl").sort({"viewsCount":-1});
      return post1;
    }
    const posts = await PostModel.find().populate("username","username").populate("avatarUrl","avatarUrl").sort({"createdAt":-1});
    return posts;
  }
  async update(userId,postId,title,text,imageUrl,tags){
    await PostModel.updateOne({_id:postId},
      {
        title,
        text,
        imageUrl,
        tags:tags.split(",")
      })
    return { success:true };
  }
  async getTags() {
    const posts = await PostModel.find().limit(5).sort({"createdAt":-1}).exec();
    const tags = posts.map(obj => obj.tags).flat().slice(0,5)
    return tags;
  }
  async getPostsWithTag(tag){
    const posts = await PostModel.find({tags:tag}).populate("username","username").populate("avatarUrl","avatarUrl")
    return posts;
  }
  async decComment(id){
    await PostModel.findByIdAndUpdate(id,{$inc: {commentsCount:-1}})
    return {success:true}
  }
}

module.exports = new PostService();