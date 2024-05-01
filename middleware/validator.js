
const { body, validationResult } = require('express-validator');

const func = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();

}


const SignupValidator = [


body('name').notEmpty().escape().withMessage('Name is required'),
body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage("Input correct mail"),
body('password').notEmpty().isLength({ min: 6 }).withMessage("put atleast six character"),
body('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/).withMessage("Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."),
body('address').isLength({min:10}).withMessage("Address Should Be Atleast Ten Character"),
func

]

const LoginValidate=[
    body('email').notEmpty().isEmail().normalizeEmail().withMessage("Input correct mail"),
body('password').notEmpty().isLength({ min: 6 }).withMessage("Incorrect Password"),
func
]
module.exports = {SignupValidator,LoginValidate}