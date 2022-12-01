const UserRouter = require('express').Router;
const authMiddleware = require("../middlwares/auth-middleware");
const postCreateValidation = require("../validations/post-validation");
const postMiddleware = require("../middlwares/post-middleware");
const postController = require("../controllers/post-controller");
const router = new UserRouter();

router.post('/create',authMiddleware,postCreateValidation,postMiddleware,postController.create)
router.post('/posts',postController.getAll)
router.get("/tags",postController.getLastTags)
router.get("/tags/:name",postController.getPostsWithTag)
router.get('/posts/:id',postController.getOne)
router.delete('/posts/:id',authMiddleware,postController.delete)
router.patch('/posts/:id',authMiddleware,postCreateValidation,postMiddleware,postController.update)
router.patch('/delete-comment/:id',postController.decComment)

module.exports = router;