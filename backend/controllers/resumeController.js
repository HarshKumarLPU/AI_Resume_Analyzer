const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { parseResume } = require('../services/parserService');
const { uploadToS3, isS3Enabled, deleteFromS3 } = require('../services/s3Service');
const { sendSuccess, sendError } = require('../utils/responseHelper');

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Please upload a file');
    }

    const { originalname, size, path: localPath, mimetype } = req.file;
    const ext = path.extname(originalname).toLowerCase();
    const fileType = ext === '.pdf' ? 'pdf' : 'docx';

    let parsedText = '';
    let isParsed = false;
    try {
      parsedText = await parseResume(localPath, fileType);
      isParsed = true;
    } catch (parseError) {
      console.error('Parsing error:', parseError);
    }

    let storageType = 'local';
    let fileUrl = `${process.env.CLIENT_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    let filePath = localPath;

    if (isS3Enabled()) {
      const s3Data = await uploadToS3(localPath, `resumes/${req.file.filename}`, mimetype);
      if (s3Data) {
        storageType = 's3';
        fileUrl = s3Data.url;
        filePath = s3Data.key;
        
        fs.unlinkSync(localPath);
      }
    }

    let groupId = req.body.groupId;
    let versionNumber = 1;

    if (groupId) {
      const latestResume = await Resume.findOne({ groupId, user: req.user._id }).sort('-versionNumber');
      if (latestResume) {
        versionNumber = latestResume.versionNumber + 1;
      } else {
        groupId = undefined;
      }
    }

    const resumeData = {
      user: req.user._id,
      originalName: originalname,
      fileType,
      fileSize: size,
      filePath,
      fileUrl,
      storageType,
      parsedText,
      isParsed,
    };

    if (groupId) {
      resumeData.groupId = groupId;
      resumeData.versionNumber = versionNumber;
    }

    const resume = await Resume.create(resumeData);

    await User.findByIdAndUpdate(req.user._id, { $inc: { resumeCount: 1 } });

    sendSuccess(res, 201, 'Resume uploaded successfully', { resume });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
};

const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort('-createdAt').populate('analysis');
    sendSuccess(res, 200, 'Resumes fetched successfully', { resumes, count: resumes.length });
  } catch (err) {
    next(err);
  }
};

const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id }).populate('analysis');
    if (!resume) {
      return sendError(res, 404, 'Resume not found');
    }
    sendSuccess(res, 200, 'Resume fetched', { resume });
  } catch (err) {
    next(err);
  }
};

const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return sendError(res, 404, 'Resume not found');
    }

    if (resume.storageType === 's3') {
      await deleteFromS3(resume.filePath);
    } else {
      if (fs.existsSync(resume.filePath)) {
        fs.unlinkSync(resume.filePath);
      }
    }

    await Resume.findByIdAndDelete(resume._id);
    
    sendSuccess(res, 200, 'Resume deleted successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
};
