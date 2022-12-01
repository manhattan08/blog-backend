const {body} = require("express-validator");


module.exports = registerValidation = [
  body('email',"Incorrect email!").optional({checkFalsy: true}).isEmail(),
  body('password',"Password must be more than 5 and less than 32").optional({checkFalsy: true}).isLength({min:5,max:32}),
  body('username',"Username, please!").optional({checkFalsy: true}).isLength({min:3,max:32}),
  body('avatarUrl','Incorrect link on avatar').optional({checkFalsy: true}).isString(),
  body('newPassword','Password must be more than 5 and less than 32').optional({checkFalsy: true}).isLength({min:5,max:32})
]