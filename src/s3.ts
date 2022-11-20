import S3 from "aws-sdk/clients/s3";
require("dotenv").config();
const bucketName = process.env.BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const fs = require("fs");

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// upload file to s3

export const uploadFile = (file: any) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams: any = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};
// download a file from s3
