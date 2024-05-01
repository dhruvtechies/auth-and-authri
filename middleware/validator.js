
const { body, validationResult } = require('express-validator');

const func = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();

}

const errorM = (msg) => (_value, { req }) => req.__(msg);

const SignupValidator = [

body('name').notEmpty().escape().withMessage(errorM('validator.error1')),
body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage(errorM('validator.error2')),
body('password').notEmpty().isLength({ min: 6 }).withMessage(errorM('validator.error3')),
body('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/).withMessage(errorM('validator.error4')),
body('address').isLength({min:10}).withMessage(errorM('validator.error5')),
func

]

const LoginValidate=[
    body('email').notEmpty().isEmail().normalizeEmail().withMessage(errorM('validator.error2')),
body('password').notEmpty().isLength({ min: 6 }).withMessage(errorM('validator.error6')),
func
]
module.exports = {SignupValidator,LoginValidate}