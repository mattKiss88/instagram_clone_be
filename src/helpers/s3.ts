import S3 from "aws-sdk/clients/s3";
import { File } from "../controllers/types";
require("dotenv").config();
const bucketName = process.env.BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const fs = require("fs");
const util = require("util");

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

interface IParams {
  Bucket: string;
  Key: string;
  Body: any;
}

// upload file to s3

export const uploadFile = (file: File) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams: IParams = {
    Bucket: bucketName as string,
    Body: fileStream,
    Key: file.filename as string,
  };

  return s3.upload(uploadParams).promise();
};
// download a file from s3

export const getFileStream = (fileKey: string) => {
  const downloadParams: { Key: string; Bucket: string } = {
    Key: fileKey,
    Bucket: bucketName || "",
  };

  // fs.writeFile("a.jpg", z, function (err: any) {
  //   if (err) return console.log("err", err);
  // });

  return s3.getObject(downloadParams).createReadStream();
};

export const getS3Objects = async (): Promise<string[]> => {
  // const s3 = new AWS.S3();
  const objectNames: string[] = [];
  let isTruncated = true;
  let continuationToken: string | undefined;

  while (isTruncated) {
    const response = await s3
      .listObjectsV2({
        Bucket: bucketName as string,
        ContinuationToken: continuationToken,
      })
      .promise();

    response.Contents?.forEach((obj) => {
      if (obj.Key) {
        objectNames.push(obj.Key);
      }
    });

    isTruncated = !!response.IsTruncated;
    continuationToken = response.NextContinuationToken;
  }

  return objectNames;
};
