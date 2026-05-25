const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');
const { analyzeResume, analyzeJDMatch, rewriteResumePoint, generateMockInterview, generateSkillGap } = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const runAnalysis = async (resume, existingAnalysis) => {
  let analysis = existingAnalysis;

  if (analysis) {
    analysis.status = 'processing';
    await analysis.save();
  } else {
    analysis = await Analysis.create({
      resume: resume._id,
      user: resume.user,
      status: 'processing',
    });
    resume.analysis = analysis._id;
    await resume.save();
  }

  try {
    const extractedText = resume.parsedText ? resume.parsedText.trim() : '';
    if (!extractedText || extractedText.length < 20 || !resume.isParsed) {
      throw new Error('Could not extract text from this resume. Please ensure it is a text-based PDF or Word document, and not a scanned image.');
    }

    const { data, modelUsed } = await analyzeResume(resume.parsedText);

    if (data.isResume === false) {
      const errorMsg = data.reason || 'This document does not appear to be a valid resume or CV. Please upload a proper resume.';
      throw new Error(errorMsg);
    }

    analysis.atsScore = data.atsScore;
    analysis.detectedSkills = data.detectedSkills;
    analysis.missingKeywords = data.missingKeywords;
    analysis.strengths = data.strengths;
    analysis.weaknesses = data.weaknesses;
    analysis.suggestions = data.suggestions;
    analysis.formattingFeedback = data.formattingFeedback;
    analysis.recommendedRoles = data.recommendedRoles;
    analysis.sectionScores = data.sectionScores;
    analysis.overallFeedback = data.overallFeedback;
    analysis.status = 'completed';
    analysis.modelUsed = modelUsed;

    await analysis.save();
    
    resume.isAnalyzed = true;
    await resume.save();

    return analysis;
  } catch (error) {
    analysis.status = 'failed';
    analysis.errorMessage = error.message;
    await analysis.save();
    throw error;
  }
};

const createAnalysis = async (req, res, next) => {
  try {
    const resumeId = req.params.resumeId;
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    
    if (!resume) {
      return sendError(res, 404, 'Resume not found');
    }

    let analysis = await Analysis.findOne({ resume: resumeId });
    if (analysis && analysis.status === 'completed') {
      return sendSuccess(res, 200, 'Analysis already completed', { analysis });
    }

    analysis = await runAnalysis(resume, analysis);
    sendSuccess(res, 201, 'Analysis completed', { analysis });
  } catch (err) {
    next(err);
  }
};

const reAnalyze = async (req, res, next) => {
  try {
    const resumeId = req.params.resumeId;
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    
    if (!resume) {
      return sendError(res, 404, 'Resume not found');
    }

    let analysis = await Analysis.findOne({ resume: resumeId });
    analysis = await runAnalysis(resume, analysis);

    sendSuccess(res, 200, 'Re-analysis completed', { analysis });
  } catch (err) {
    next(err);
  }
};

const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({ resume: req.params.resumeId, user: req.user._id }).populate('resume');
    if (!analysis) {
      return sendError(res, 404, 'Analysis not found');
    }
    sendSuccess(res, 200, 'Analysis fetched successfully', { analysis });
  } catch (err) {
    next(err);
  }
};

const getAllAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id }).sort('-createdAt').populate('resume');
    sendSuccess(res, 200, 'Analyses fetched', { analyses, count: analyses.length });
  } catch (err) {
    next(err);
  }
};

const deleteAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ resume: req.params.resumeId, user: req.user._id });
    if (!analysis) {
      return sendError(res, 404, 'Analysis not found');
    }

    await Resume.findByIdAndUpdate(analysis.resume, { isAnalyzed: false, analysis: null });

    sendSuccess(res, 200, 'Analysis deleted');
  } catch (err) {
    next(err);
  }
};

const matchJD = async (req, res, next) => {
  try {
    const { jdText } = req.body;
    if (!jdText) return sendError(res, 400, 'Job description text is required');

    const analysis = await Analysis.findOne({ resume: req.params.resumeId, user: req.user._id }).populate('resume');
    if (!analysis || !analysis.resume) return sendError(res, 404, 'Analysis or resume not found');

    const result = await analyzeJDMatch(analysis.resume.parsedText, jdText);
    
    // Save to analysis document
    analysis.jobDescriptionMatch = { ...result, jdText };
    await analysis.save();

    sendSuccess(res, 200, 'JD Match completed', { jobDescriptionMatch: analysis.jobDescriptionMatch });
  } catch (err) {
    next(err);
  }
};

const rewritePoint = async (req, res, next) => {
  try {
    const { bulletPoint } = req.body;
    if (!bulletPoint) return sendError(res, 400, 'Bullet point text is required');

    const rewrittenText = await rewriteResumePoint(bulletPoint);
    sendSuccess(res, 200, 'Rewrite completed', { rewrittenText });
  } catch (err) {
    next(err);
  }
};

const generateInterview = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({ resume: req.params.resumeId, user: req.user._id }).populate('resume');
    if (!analysis || !analysis.resume) return sendError(res, 404, 'Analysis or resume not found');

    const result = await generateMockInterview(analysis.resume.parsedText);
    
    analysis.mockInterview = result;
    await analysis.save();

    sendSuccess(res, 200, 'Interview questions generated', { mockInterview: analysis.mockInterview });
  } catch (err) {
    next(err);
  }
};

const analyzeSkillGap = async (req, res, next) => {
  try {
    const { targetRole } = req.body;
    if (!targetRole) return sendError(res, 400, 'Target role is required');

    const analysis = await Analysis.findOne({ resume: req.params.resumeId, user: req.user._id }).populate('resume');
    if (!analysis || !analysis.resume) return sendError(res, 404, 'Analysis or resume not found');

    const result = await generateSkillGap(analysis.resume.parsedText, targetRole);
    
    analysis.skillGap = result;
    await analysis.save();

    sendSuccess(res, 200, 'Skill gap analysis completed', { skillGap: analysis.skillGap });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAnalysis,
  reAnalyze,
  getAnalysis,
  getAllAnalyses,
  deleteAnalysis,
  matchJD,
  rewritePoint,
  generateInterview,
  analyzeSkillGap,
};
