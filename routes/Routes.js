const express = require('express');
const userController = require('../controller/Controller.js');
const authorization = require('../middleware/Authorization.js');
const router = express.Router();
const {SignupValidator,LoginValidate} = require('../middleware/validator.js')



//for validator
const userData = require('../modal/Modal.js');

router.post('/usersign',SignupValidator ,userController.UserRegistration);




router.post('/userlogin',LoginValidate,userController.UserLogin);



// Protected routes requiring authorization middleware
router.get('/user/:id', authorization, userController.getUserById);
router.put('/user/:id', authorization, userController.updateUser);
router.delete('/user/:id', authorization, userController.deleteUser);

router.get("/", userController.Home);


//routes for reset and forget password

router.post('/forgotPassword',userController.forgetPassword);

router.patch('/reset',userController.ResetPass);



module.exports = router;
