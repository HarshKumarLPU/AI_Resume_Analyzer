const express = require('express');
const { createAnalysis, reAnalyze, getAnalysis, getAllAnalyses, deleteAnalysis } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');
const { analysisLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);

router.post('/:resumeId', analysisLimiter, createAnalysis);
router.post('/:resumeId/reanalyze', analysisLimiter, reAnalyze);
router.get('/:resumeId', getAnalysis);
router.get('/', getAllAnalyses);
router.delete('/:resumeId', deleteAnalysis);

module.exports = router;
