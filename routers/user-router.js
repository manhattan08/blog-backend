const UserRouter = require('express').Router;
const userController = require('../controllers/user-controller')
const authMiddleware = require("../middlwares/auth-middleware")
const postMiddleware = require("../middlwares/post-middleware")
const checkRoleMiddleware = require("../middlwares/checkRole-middleware")
const  registerValidation  = require("../validations/auth-register")
const multer = require("multer");
const router = new UserRouter();

router.post('/auth/registration',registerValidation, userController.registration);
router.post('/auth/login',userController.login);
router.post('/auth/logout',userController.logout);
router.get('/auth/me',authMiddleware,userController.getUser)
router.get('/auth/activate/:link',userController.activate);
router.get('/auth/refresh',userController.refresh);
router.post('/auth/update',authMiddleware,registerValidation,postMiddleware,userController.userUpdate);
router.get('/users',checkRoleMiddleware,userController.getUsers);
router.patch('/userBan/:id',checkRoleMiddleware,userController.userBan);
router.patch('/setModer/:id',checkRoleMiddleware,userController.setModer);


const storage = multer.diskStorage({
  destination:(_,__,cb)=>{
    cb(null,"uploads");
  },
  filename:(_,file,cb)=>{
    cb(null,file.originalname)
  },
});

const upload = multer({storage});

router.post("/upload",upload.single("image"),(req,res)=>{
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

module.exports = router;
