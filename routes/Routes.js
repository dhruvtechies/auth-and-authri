const express = require('express');
const userController = require('../controller/Controller.js');
 const authorization = require('../middleware/Authorization.js');
const router = express.Router();

router.post('/usersign', userController.UserRegistration);
router.post('/userlogin', userController.UserLogin);


// Protected routes requiring authorization middleware
router.get('/user/:id', authorization, userController.getUserById);
router.put('/user/:id', authorization, userController.updateUser);
router.delete('/user/:id', authorization, userController.deleteUser);

router.get('/user', userController.HomeController);



module.exports = router;
