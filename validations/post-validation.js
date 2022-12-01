const {body} = require("express-validator");


module.exports = postCreatetValidation = [
  body('title',"Enter article title").isLength({min:4}).isString(),
  body('text',"Enter the text of the article").isLength({min:10}).isString(),
  body('tags',"Incorrect format tags").optional().isString(),
  body('imageUrl','Incorrect link on photo').optional().isString(),
]