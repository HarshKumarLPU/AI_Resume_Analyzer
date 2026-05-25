const AWS = require('aws-sdk');
const fs = require('fs');

const isS3Enabled = () => {
  return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET);
};

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

const uploadToS3 = async (localPath, s3Key, mimeType) => {
  if (!isS3Enabled()) return null;

  const fileContent = fs.readFileSync(localPath);
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: s3Key,
    Body: fileContent,
    ContentType: mimeType,
  };

  const data = await s3.upload(params).promise();
  return {
    url: data.Location,
    key: data.Key,
  };
};

const deleteFromS3 = async (s3Key) => {
  if (!isS3Enabled()) return;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: s3Key,
  };

  await s3.deleteObject(params).promise();
};

module.exports = {
  isS3Enabled,
  uploadToS3,
  deleteFromS3,
};
