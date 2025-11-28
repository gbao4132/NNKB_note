const express = require('express');
const router = express.Router();
const FolderController = require('../controllers/folderController');

const {verifyToken} = require('../middlewares/authMiddleware.js');

// GET /api/folders
router.get('/', verifyToken, FolderController.getAllFolders);

// POST /api/folders
router.post('/', verifyToken, FolderController.createFolder);

module.exports = router;