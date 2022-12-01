const UserRouter = require('express').Router;
const authMiddleware = require("../middlwares/auth-middleware");
const commentController = require("../controllers/comment-cotroller");
const router = new UserRouter();

router.post('/comment/:id',authMiddleware,commentController.create)
router.get('/comment/:id',commentController.getCommentsByPost)
router.get('/comments',commentController.getLastComments)
router.delete('/comment/:id',commentController.deleteComment)

module.exports = router;