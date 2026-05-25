const express = require('express');
const { uploadResume, getResumes, getResumeById, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.post('/upload', uploadMiddleware, uploadResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;
