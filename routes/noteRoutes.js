const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/noteController');
const { verifyToken, checkOwnership } = require('../middlewares/authMiddleware');
const { createNoteValidation } = require('../validators/noteValidator'); 

router.post('/', verifyToken, NoteController.createNote); 

router.get('/', verifyToken, NoteController.getAllNotes);

module.exports = router;