const express = require('express');
const { createAnalysis, reAnalyze, getAnalysis, getAllAnalyses, deleteAnalysis, matchJD, rewritePoint, generateInterview, analyzeSkillGap } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');
const { analysisLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(protect);

// Specific routes
router.get('/', getAllAnalyses);
router.post('/rewrite', analysisLimiter, rewritePoint);

// Dynamic routes
router.post('/:resumeId', analysisLimiter, createAnalysis);
router.post('/:resumeId/reanalyze', analysisLimiter, reAnalyze);
router.get('/:resumeId', getAnalysis);
router.delete('/:resumeId', deleteAnalysis);

// Feature routes with dynamic parameters
router.post('/:resumeId/jd-match', analysisLimiter, matchJD);
router.post('/:resumeId/mock-interview', analysisLimiter, generateInterview);
router.post('/:resumeId/skill-gap', analysisLimiter, analyzeSkillGap);

module.exports = router;
