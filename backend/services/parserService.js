const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const parseDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

const parseResume = async (filePath, fileType) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found for parsing');
  }

  let text = '';
  if (fileType === 'pdf') {
    text = await parsePDF(filePath);
  } else if (fileType === 'docx') {
    text = await parseDOCX(filePath);
  } else {
    throw new Error('Unsupported file format for parsing');
  }

  return text;
};

module.exports = {
  parseResume,
};
