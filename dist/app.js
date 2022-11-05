"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var port = 3001;
var body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
var cors = require("cors");
var corsOptions;
corsOptions = {
    origin: ["*", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessState: 204,
};
app.use(cors(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.send("Hello from Instagram! running on port ".concat(port));
});
exports.default = app;
