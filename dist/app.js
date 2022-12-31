"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var auth_1 = require("./routes/auth");
var post_1 = require("./routes/post");
var user_1 = require("./routes/user");
var comment_1 = require("./routes/comment");
var _a = require("../models"), Post = _a.Post, Post_media = _a.Post_media;
var app = (0, express_1.default)();
var port = 3001;
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
app.use("/auth", auth_1.authRouter);
app.use("/post", post_1.postRouter);
app.use("/user", user_1.userRouter);
app.use("/comment", comment_1.commentRouter);
app.get("/", function (req, res) {
    res.send("Hello from Instagram! Running on port ".concat(port));
});
exports.default = app;
