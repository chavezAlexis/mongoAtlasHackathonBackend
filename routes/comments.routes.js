const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { saveComment } = require('../controllers/comment.controllers');


router.post('/publish-comment',[
    check('comment', 'Comment is required').not().isEmpty(),
    check('user', 'User is required').not().isEmpty(),
    check('user_id', 'User id is required').not().isEmpty(),
    check('item_id', 'Item id is required').not().isEmpty()
],saveComment)



module.exports = router;