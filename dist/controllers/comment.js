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
var getUserPostsAndStats_1 = require("../helpers/getUserPostsAndStats");
var Op = require("sequelize").Op;
var _a = require("../../models"), Comment = _a.Comment, Comment_likes = _a.Comment_likes;
require("dotenv").config();
function addComment(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var post_id, _b, comment, commentRepliedToId, user_id, post, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    post_id = req.params.post_id;
                    _b = req.body, comment = _b.comment, commentRepliedToId = _b.commentRepliedToId;
                    user_id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                    return [4 /*yield*/, Comment.create({
                            createdByUserId: user_id,
                            postId: post_id,
                            comment: comment,
                            commentRepliedToId: commentRepliedToId,
                        })];
                case 1:
                    post = _c.sent();
                    // Send success response with created comment data
                    res.status(201).send(__assign({}, post.dataValues));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _c.sent();
                    // Catch and handle errors
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
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var post_id, user_id_1, comments, totalSubComments_1, error_2;
        var _b, _c;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, , 5]);
                    post_id = req.params.post_id;
                    user_id_1 = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                    return [4 /*yield*/, Comment.findAll({
                            raw: true,
                            where: {
                                postId: post_id,
                                commentRepliedToId: (_b = {},
                                    _b[Op.is] = null,
                                    _b),
                            },
                        })];
                case 1:
                    comments = _d.sent();
                    return [4 /*yield*/, Comment.findAll({
                            raw: true,
                            where: {
                                postId: post_id,
                                commentRepliedToId: (_c = {},
                                    _c[Op.not] = null,
                                    _c),
                            },
                        })];
                case 2:
                    totalSubComments_1 = _d.sent();
                    return [4 /*yield*/, Promise.all(comments.map(function (comment) { return __awaiter(_this, void 0, void 0, function () {
                            var likeCount, liked, userDetails, subComments;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Comment_likes.count({
                                            where: { commentId: comment.id },
                                        })];
                                    case 1:
                                        likeCount = _a.sent();
                                        return [4 /*yield*/, Comment_likes.findOne({
                                                where: { commentId: comment.id, userId: user_id_1 },
                                            })];
                                    case 2:
                                        liked = _a.sent();
                                        return [4 /*yield*/, (0, getUserPostsAndStats_1.getUserDetails)(comment.createdByUserId)];
                                    case 3:
                                        userDetails = _a.sent();
                                        return [4 /*yield*/, Promise.all(totalSubComments_1
                                                .filter(function (subComment) {
                                                return subComment.commentRepliedToId === comment.id;
                                            })
                                                .map(function (subComment) { return __awaiter(_this, void 0, void 0, function () {
                                                var subCommentUserDetails, subCommentLiked, subCommentTotalLikes;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, (0, getUserPostsAndStats_1.getUserDetails)(subComment.createdByUserId)];
                                                        case 1:
                                                            subCommentUserDetails = _a.sent();
                                                            return [4 /*yield*/, Comment_likes.findOne({
                                                                    raw: true,
                                                                    where: { commentId: subComment.id, userId: user_id_1 },
                                                                })];
                                                        case 2:
                                                            subCommentLiked = _a.sent();
                                                            return [4 /*yield*/, Comment_likes.count({
                                                                    where: { commentId: subComment.id },
                                                                })];
                                                        case 3:
                                                            subCommentTotalLikes = _a.sent();
                                                            return [2 /*return*/, __assign(__assign({}, subComment), { liked: subCommentLiked === null ? false : true, likeCount: subCommentTotalLikes, user: __assign({}, subCommentUserDetails) })];
                                                    }
                                                });
                                            }); }))];
                                    case 4:
                                        subComments = _a.sent();
                                        // Return processed comment with additional details
                                        return [2 /*return*/, __assign(__assign({}, comment), { likeCount: likeCount, liked: liked === null ? false : true, subCommentCount: subComments === null || subComments === void 0 ? void 0 : subComments.length, subComments: subComments, user: __assign({}, userDetails) })];
                                }
                            });
                        }); }))];
                case 3:
                    // Process each comment to get additional details
                    comments = _d.sent();
                    // Sort comments by date in descending order
                    comments.sort(function (a, b) {
                        return new Date(b.createdAt) - new Date(a === null || a === void 0 ? void 0 : a.createdAt);
                    });
                    // Send success response with processed comments
                    res.status(200).send({
                        comments: comments,
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _d.sent();
                    console.log(error_2, "******************************* GET COMMENTS ERROR **********************************");
                    res.status(400).send(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getCommentsByPostId = getCommentsByPostId;
// async function toggleCommentLike(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { commentId } = req.body;
//   const userId: number = req?.user?.id;
//   const liked = await Comment_likes.findOne({
//     where: { commentId, userId },
//   });
//   if (liked) {
//     await Comment_likes.destroy({
//       where: { commentId, userId },
//     });
//   } else {
//     await Comment_likes.create({
//       commentId,
//       userId,
//     });
//   }
//   const likeCount: number = await Comment_likes.count({
//     where: { commentId },
//   });
//   res.status(200).send({ likeCount });
// }
function toggleCommentLike(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var commentId, userId, liked, likeCount, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    commentId = req.body.commentId;
                    userId = req.user.id;
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
                    likeCount = _a.sent();
                    // Send a success response with the updated like count
                    res.status(200).send({ likeCount: likeCount });
                    return [3 /*break*/, 8];
                case 7:
                    error_3 = _a.sent();
                    console.log(error_3, "******************************* TOGGLE COMMENT LIKE ERROR **********************************");
                    res.status(400).send("Error toggling comment like");
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.toggleCommentLike = toggleCommentLike;
