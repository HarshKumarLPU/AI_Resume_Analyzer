const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    detectedSkills: [String],
    missingKeywords: [String],
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    formattingFeedback: [String],
    recommendedRoles: [String],
    sectionScores: {
      contactInfo: { type: Number, min: 0, max: 100 },
      summary: { type: Number, min: 0, max: 100 },
      experience: { type: Number, min: 0, max: 100 },
      education: { type: Number, min: 0, max: 100 },
      skills: { type: Number, min: 0, max: 100 },
      formatting: { type: Number, min: 0, max: 100 },
    },
    overallFeedback: {
      type: String,
    },
    jobDescriptionMatch: {
      jdText: String,
      matchPercentage: { type: Number, min: 0, max: 100 },
      missingSkills: [String],
      missingKeywords: [String],
      atsCompatibility: { type: Number, min: 0, max: 100 },
      mismatchReasons: [String],
      suggestions: [String]
    },
    mockInterview: {
      technicalQuestions: [{ question: String, answer: String }],
      projectQuestions: [{ question: String, answer: String }],
      hrQuestions: [{ question: String, answer: String }],
      difficultyLevel: String
    },
    skillGap: {
      targetRole: String,
      missingSkills: [String],
      roadmap: [{ week: String, focus: String, tasks: [String] }]
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: {
      type: String,
    },
    modelUsed: {
      type: String,
    },
  },
  { timestamps: true }
);

const Analysis = mongoose.model('Analysis', analysisSchema);
module.exports = Analysis;
