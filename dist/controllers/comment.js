"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCommentLike = exports.getCommentsByPostId = exports.addComment = void 0;
var Op = require("sequelize").Op;
var _a = require("../../models"), Comment = _a.Comment, User = _a.User, Profile_picture = _a.Profile_picture, Comment_likes = _a.Comment_likes;
require("dotenv").config();
function addComment(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var post_id, _a, comment, commentRepliedToId, user_id, post, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    post_id = req.params.post_id;
                    _a = req.body, comment = _a.comment, commentRepliedToId = _a.commentRepliedToId;
                    user_id = req.user.user.id;
                    return [4 /*yield*/, Comment.create({
                            createdByUserId: user_id,
                            postId: post_id,
                            comment: comment,
                            commentRepliedToId: commentRepliedToId,
                        })];
                case 1:
                    post = _b.sent();
                    res.status(201).send(__assign({}, post.dataValues));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.log(error_1);
                    res.status(400).send(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.addComment = addComment;
function getCommentsByPostId(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var post_id, user_id_1, comments, totalSubComments_1, error_2;
        var _a, _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    post_id = req.params.post_id;
                    user_id_1 = req.user.user.id;
                    console.log("userid 99999999999999999999999999999", user_id_1);
                    return [4 /*yield*/, Comment.findAll({
                            where: {
                                postId: post_id,
                                commentRepliedToId: (_a = {},
                                    _a[Op.is] = null,
                                    _a),
                            },
                        })];
                case 1:
                    comments = _c.sent();
                    return [4 /*yield*/, Comment.findAll({
                            where: {
                                postId: post_id,
                                commentRepliedToId: (_b = {},
                                    _b[Op.not] = null,
                                    _b),
                            },
                        })];
                case 2:
                    totalSubComments_1 = _c.sent();
                    return [4 /*yield*/, Promise.all(comments.map(function (comment) { return __awaiter(_this, void 0, void 0, function () {
                            var user, avatar, totalLikes, liked, subComments;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, User.findOne({
                                            where: { id: comment.createdByUserId },
                                            raw: true,
                                        })];
                                    case 1:
                                        user = _a.sent();
                                        return [4 /*yield*/, Profile_picture.findOne({
                                                where: { userId: comment.createdByUserId },
                                            })];
                                    case 2:
                                        avatar = _a.sent();
                                        return [4 /*yield*/, Comment_likes.count({
                                                where: { commentId: comment.id },
                                            })];
                                    case 3:
                                        totalLikes = _a.sent();
                                        return [4 /*yield*/, Comment_likes.findOne({
                                                where: { commentId: comment.id, userId: user_id_1 },
                                            })];
                                    case 4:
                                        liked = _a.sent();
                                        subComments = totalSubComments_1.filter(function (subComment) { return subComment.commentRepliedToId === comment.id; });
                                        console.log(liked, "-zzzzzzzzzzzzzzzzzzzzzzzzz>");
                                        return [2 /*return*/, __assign(__assign({}, comment.dataValues), { totalLikes: totalLikes, liked: liked === null ? false : true, subCommentCount: subComments === null || subComments === void 0 ? void 0 : subComments.length, subComments: subComments, user: __assign(__assign({}, user), { avatar: avatar === null || avatar === void 0 ? void 0 : avatar.mediaFileId }) })];
                                }
                            });
                        }); }))];
                case 3:
                    comments = _c.sent();
                    console.log("---------------------------------->", comments);
                    res.status(200).send({
                        comments: comments,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _c.sent();
                    console.log(error_2, "******************************* GET COMMENTS ERROR **********************************");
                    res.status(400).send(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getCommentsByPostId = getCommentsByPostId;
function toggleCommentLike(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var commentId, userId, liked, totalLikes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commentId = req.body.commentId;
                    userId = req.user.user.id;
                    return [4 /*yield*/, Comment_likes.findOne({
                            where: { commentId: commentId, userId: userId },
                        })];
                case 1:
                    liked = _a.sent();
                    if (!liked) return [3 /*break*/, 3];
                    return [4 /*yield*/, Comment_likes.destroy({
                            where: { commentId: commentId, userId: userId },
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, Comment_likes.create({
                        commentId: commentId,
                        userId: userId,
                    })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, Comment_likes.count({
                        where: { commentId: commentId },
                    })];
                case 6:
                    totalLikes = _a.sent();
                    res.status(200).send({ totalLikes: totalLikes });
                    return [2 /*return*/];
            }
        });
    });
}
exports.toggleCommentLike = toggleCommentLike;
