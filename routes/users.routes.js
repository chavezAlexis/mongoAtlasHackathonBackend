const { Router } = require('express');
const { isUserExist, saveUser, getUser, validateUserByToken } = require('../controllers/users.controlles');
const { check } = require('express-validator');
const validateJWT = require('../middlewares/validateJWT');


const router = Router();
router.post('/login', [
    check('userName', 'User name is required').not().isEmpty(),
    check('password', 'password is required and length should be greater than 6').isLength({ min: 6 })
], getUser);
router.post('/register', [
    check('userName', 'userName is required').not().isEmpty(),
    check('password', 'password is required and length should be greater than 6').isLength({ min: 6 }),
], saveUser);
router.get('/get-user/:userName', isUserExist);
router.get('/verify-identity-by-token', validateJWT, validateUserByToken);
module.exports = router;