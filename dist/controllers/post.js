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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLike = exports.getFeed = exports.getImage = exports.getAllPosts = exports.createPost = void 0;
var s3_1 = require("../helpers/s3");
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var _a = require("../../models"), Post = _a.Post, Post_media = _a.Post_media, User = _a.User, Profile_picture = _a.Profile_picture, Follower = _a.Follower, Post_likes = _a.Post_likes;
require("dotenv").config();
var unlinkFile = util_1.default.promisify(fs_1.default.unlink);
function createPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var file, post, image, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    file = req.file;
                    return [4 /*yield*/, (0, s3_1.uploadFile)(file)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Post.create({
                            caption: req.body.caption,
                            userId: req.body.userId,
                        })];
                case 2:
                    post = _a.sent();
                    return [4 /*yield*/, Post_media.create({
                            postId: post.id,
                            mediaFileId: file.filename,
                            position: 1,
                        })];
                case 3:
                    image = _a.sent();
                    return [4 /*yield*/, unlinkFile(file.path)];
                case 4:
                    _a.sent();
                    res.status(201).send({ post: post, image: image });
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.log(error_1);
                    res.status(400).send(error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.createPost = createPost;
function getAllPosts(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, posts, postArr, user, profilePic, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    id = req.params.id;
                    return [4 /*yield*/, Post.findAll({
                            where: { userId: id },
                        })];
                case 1:
                    posts = _a.sent();
                    return [4 /*yield*/, Promise.all(posts.map(function (post) { return __awaiter(_this, void 0, void 0, function () {
                            var images;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Post_media.findAll({
                                            where: { postId: post.id },
                                        })];
                                    case 1:
                                        images = _a.sent();
                                        return [2 /*return*/, { post: post, images: images }];
                                }
                            });
                        }); }))];
                case 2:
                    postArr = _a.sent();
                    return [4 /*yield*/, User.findOne({
                            where: { id: id },
                        })];
                case 3:
                    user = _a.sent();
                    return [4 /*yield*/, Profile_picture.findOne({
                            where: { userId: id },
                        })];
                case 4:
                    profilePic = _a.sent();
                    res.status(201).send({
                        posts: postArr,
                        user: { username: user.username, avatar: profilePic === null || profilePic === void 0 ? void 0 : profilePic.mediaFileId },
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.log(error_2);
                    res.status(400).send(error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getAllPosts = getAllPosts;
function getImage(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var key, readStream;
        return __generator(this, function (_a) {
            try {
                key = req.params.key;
                readStream = (0, s3_1.getFileStream)(key);
                readStream.pipe(res);
            }
            catch (error) {
                console.log("img err", error);
                res.status(400).send(error);
            }
            return [2 /*return*/];
        });
    });
}
exports.getImage = getImage;
function getFeed(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id_1, following, feedArr, error_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    id_1 = req.params.id;
                    return [4 /*yield*/, Follower.findAll({
                            where: { followerUserId: id_1 },
                        })];
                case 1:
                    following = _a.sent();
                    return [4 /*yield*/, Promise.all(following.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var posts, postArr;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Post.findAll({
                                            where: { userId: user === null || user === void 0 ? void 0 : user.followingUserId },
                                        })];
                                    case 1:
                                        posts = _a.sent();
                                        console.log(posts, "posts---------------------------------->");
                                        return [4 /*yield*/, Promise.all(posts.map(function (post) { return __awaiter(_this, void 0, void 0, function () {
                                                var images, user, profilePic, totalLikes, likesPost;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, Post_media.findAll({
                                                                where: { postId: post.id },
                                                            })];
                                                        case 1:
                                                            images = _a.sent();
                                                            return [4 /*yield*/, User.findOne({
                                                                    where: { id: post.userId },
                                                                })];
                                                        case 2:
                                                            user = _a.sent();
                                                            console.log(user, "user ----------------------------------->");
                                                            return [4 /*yield*/, Profile_picture.findOne({
                                                                    where: { userId: post.userId },
                                                                })];
                                                        case 3:
                                                            profilePic = _a.sent();
                                                            return [4 /*yield*/, Post_likes.findAll({
                                                                    where: { postId: post.id },
                                                                })];
                                                        case 4:
                                                            totalLikes = _a.sent();
                                                            return [4 /*yield*/, Post_likes.findOne({
                                                                    where: { postId: post.id, userId: id_1 },
                                                                })];
                                                        case 5:
                                                            likesPost = _a.sent();
                                                            return [2 /*return*/, {
                                                                    post: __assign(__assign({}, post.dataValues), { totalLikes: totalLikes.length, likes: likesPost ? true : false }),
                                                                    images: images,
                                                                    user: __assign(__assign({}, user.dataValues), { avatar: profilePic.mediaFileId }),
                                                                }];
                                                    }
                                                });
                                            }); }))];
                                    case 2:
                                        postArr = _a.sent();
                                        return [2 /*return*/, postArr];
                                }
                            });
                        }); }))
                            .then(function (array) {
                            return array
                                .flat(1)
                                .sort(function (a, b) { return a.post.createdAt - b.post.createdAt; });
                        })
                            .catch(function (err) { return console.log(err); })];
                case 2:
                    feedArr = _a.sent();
                    res.status(201).send({
                        feed: feedArr,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.log(error_3);
                    res.status(400).send(error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getFeed = getFeed;
function toggleLike(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, postId, userId, like, data, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    _a = req.body, postId = _a.postId, userId = _a.userId;
                    return [4 /*yield*/, Post_likes.findOne({
                            where: { postId: postId, userId: userId },
                        })];
                case 1:
                    like = _b.sent();
                    data = void 0;
                    if (!like) return [3 /*break*/, 3];
                    return [4 /*yield*/, unlikePost(postId, userId)];
                case 2:
                    data = _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, likePost(postId, userId)];
                case 4:
                    data = _b.sent();
                    _b.label = 5;
                case 5:
                    res.status(201).send({ data: data });
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _b.sent();
                    console.log(error_4);
                    res.status(400).send(error_4);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.toggleLike = toggleLike;
function likePost(postId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var like, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // const { postId, userId } = req.body;
                    console.log(postId, userId, "like post ------------------------->");
                    return [4 /*yield*/, Post_likes.create({
                            postId: postId,
                            userId: userId,
                        })];
                case 1:
                    like = _a.sent();
                    console.log(like, "like ------------------------->");
                    return [2 /*return*/, like];
                case 2:
                    error_5 = _a.sent();
                    console.log(error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function unlikePost(postId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var like, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Post_likes.destroy({
                            where: { postId: postId, userId: userId },
                        })];
                case 1:
                    like = _a.sent();
                    return [2 /*return*/, like];
                case 2:
                    error_6 = _a.sent();
                    console.log(error_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getLikes(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var postId, likes, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    postId = req.params.postId;
                    return [4 /*yield*/, Post_likes.findAll({
                            where: { postId: postId },
                        })];
                case 1:
                    likes = _a.sent();
                    // const likesArr = await Promise.all(
                    //   likes.map(async (like: any) => {
                    //     const user = await User.findOne({
                    //       where: { id: like.userId },
                    //     });
                    //     const profilePic = await Profile_picture.findOne({
                    //       where: { userId: like.userId },
                    //     });
                    //     return { ...user.dataValues, avatar: profilePic.mediaFileId };
                    //   })
                    // );
                    return [2 /*return*/, likes.length];
                case 2:
                    error_7 = _a.sent();
                    console.log(error_7);
                    res.status(400).send(error_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
