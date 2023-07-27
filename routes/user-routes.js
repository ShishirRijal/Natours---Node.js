const express = require('express');
const userController = require(`${__dirname}/../controllers/user-controller.js`);
const authController = require(`${__dirname}/../controllers/auth-controller.js`);

const router  = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);  
 
router.route('/')
    .get(userController.getAllUsers) 
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;