const { Router } = require("express");
const {  getByName, autoComplete, getByCategories } = require("../controllers/items.controllers");

const router = Router();

router.get('/getByName/:name', getByName);
router.get('/autocomplete/:name', autoComplete);
router.post('/getByCategories', getByCategories);

module.exports = router;