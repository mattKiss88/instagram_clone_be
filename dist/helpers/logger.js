"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessLog = void 0;
var moment_1 = __importDefault(require("moment"));
var fs = require("fs");
var path = require("path");
var accessLogStream = fs.createWriteStream(path.join("access.log"), {
    flags: "a",
});
var accessLog = function (name, data) {
    if (typeof data === "object") {
        data = JSON.stringify(data, null, 2);
    }
    else if (typeof data === "symbol" || typeof data === "function") {
        data = data === null || data === void 0 ? void 0 : data.toString();
    }
    accessLogStream.write("".concat(name, ": ").concat((0, moment_1.default)().format("DD/MM/YYY HH:mm"), " ").concat(data + "\n \n"));
};
exports.accessLog = accessLog;
