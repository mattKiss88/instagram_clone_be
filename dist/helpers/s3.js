"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStream = exports.uploadFile = void 0;
var s3_1 = __importDefault(require("aws-sdk/clients/s3"));
require("dotenv").config();
var bucketName = process.env.BUCKET_NAME;
var region = process.env.AWS_REGION;
var accessKeyId = process.env.AWS_ACCESS_KEY_ID;
var secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
var fs = require("fs");
var util = require("util");
var s3 = new s3_1.default({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});
// upload file to s3
var uploadFile = function (file) {
    var fileStream = fs.createReadStream(file.path);
    var uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
};
exports.uploadFile = uploadFile;
// download a file from s3
var getFileStream = function (fileKey) {
    var downloadParams = {
        Key: fileKey,
        Bucket: bucketName || "",
    };
    // fs.writeFile("a.jpg", z, function (err: any) {
    //   if (err) return console.log("err", err);
    // });
    return s3.getObject(downloadParams).createReadStream();
};
exports.getFileStream = getFileStream;
