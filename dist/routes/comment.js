"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
var express_1 = require("express");
var comment_1 = require("../controllers/comment");
var router = (0, express_1.Router)();
exports.commentRouter = router;
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
router.post("/:post_id", comment_1.addComment);
router.get("/:post_id", comment_1.getCommentsByPostId);
