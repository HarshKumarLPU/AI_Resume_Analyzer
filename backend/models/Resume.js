const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx'],
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    storageType: {
      type: String,
      enum: ['local', 's3'],
      default: 'local',
    },
    parsedText: {
      type: String,
    },
    isParsed: {
      type: Boolean,
      default: false,
    },
    isAnalyzed: {
      type: Boolean,
      default: false,
    },
    analysis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
      default: null,
    },
    groupId: {
      type: String,
      default: function() {
        return this._id.toString();
      }
    },
    versionNumber: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
