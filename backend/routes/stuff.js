const express = require('express');
const router = express.Router();

// Import Controller
const stuffCtrl = require('../controllers/stuff');

// Import middleware to apply auth to route action
const auth = require('../middleware/auth');

// Import multer-config to manage files
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, stuffCtrl.createThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllThing);

module.exports=router;