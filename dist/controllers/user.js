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
exports.getFriends = exports.patchProfileImg = exports.searchUser = exports.followUser = exports.getUser = void 0;
var getUserPostsAndStats_1 = require("../helpers/getUserPostsAndStats");
var s3_1 = require("../helpers/s3");
var Op = require("sequelize").Op;
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var logger_1 = require("../helpers/logger");
var unlinkFile = util_1.default.promisify(fs_1.default.unlink);
var _a = require("../../models"), Post = _a.Post, User = _a.User, Profile_picture = _a.Profile_picture, Follower = _a.Follower;
require("dotenv").config();
function getUser(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var id, user, userDetails, isFollowing, followingUsers, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    id = req.params.id;
                    return [4 /*yield*/, User.findOne({
                            attributes: { exclude: ["password"] },
                            raw: true,
                            where: { id: id },
                        })];
                case 1:
                    user = _b.sent();
                    return [4 /*yield*/, (0, getUserPostsAndStats_1.getUserDetails)(user.id)];
                case 2:
                    userDetails = _b.sent();
                    return [4 /*yield*/, Follower.findOne({
                            where: {
                                followerUserId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
                                followingUserId: id,
                            },
                        })];
                case 3:
                    isFollowing = _b.sent();
                    return [4 /*yield*/, Follower.findAll({
                            where: {
                                followerUserId: user.id,
                            },
                            attributes: ["id"],
                        })];
                case 4:
                    followingUsers = _b.sent();
                    console.log(followingUsers);
                    followingUsers = followingUsers.map(function (user) { return user.id; });
                    res.status(201).send({
                        user: __assign(__assign({}, userDetails), { isFollowing: !!isFollowing }),
                        followingUsers: followingUsers,
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    console.log(error_1);
                    res.status(400).send(error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getUser = getUser;
function followUser(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var userObj, following, follow, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    userObj = req === null || req === void 0 ? void 0 : req.user;
                    return [4 /*yield*/, Follower.findOne({
                            where: {
                                followerUserId: userObj === null || userObj === void 0 ? void 0 : userObj.id,
                                followingUserId: (_a = req.body) === null || _a === void 0 ? void 0 : _a.userId,
                            },
                        })];
                case 1:
                    following = _c.sent();
                    if (!following) return [3 /*break*/, 3];
                    // return res.status(400).send("You are already following this user");
                    return [4 /*yield*/, Follower.destroy({
                            where: {
                                followerUserId: userObj === null || userObj === void 0 ? void 0 : userObj.id,
                                followingUserId: (_b = req.body) === null || _b === void 0 ? void 0 : _b.userId,
                            },
                        })];
                case 2:
                    // return res.status(400).send("You are already following this user");
                    _c.sent();
                    return [2 /*return*/, res.status(201).send("Unfollowed")];
                case 3: return [4 /*yield*/, Follower.create({
                        followerUserId: userObj === null || userObj === void 0 ? void 0 : userObj.id,
                        followingUserId: req.body.userId,
                        createdAt: new Date(),
                    })];
                case 4:
                    follow = _c.sent();
                    res.status(201).send({ follow: follow });
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _c.sent();
                    console.log(error_2);
                    res.status(400).send(error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.followUser = followUser;
function searchUser(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var search, _b, username, fullName, filterUsers, error_3;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    search = req.query.search;
                    _b = (_a = req.user) !== null && _a !== void 0 ? _a : {}, username = _b.username, fullName = _b.fullName;
                    (0, logger_1.accessLog)("Psearch error", req.user);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, User.findAll({
                            where: (_c = {},
                                _c[Op.or] = [
                                    {
                                        username: (_d = {},
                                            _d[Op.like] = "%".concat(search === null || search === void 0 ? void 0 : search.toLowerCase(), "%"),
                                            _d[Op.ne] = username,
                                            _d),
                                    },
                                    {
                                        fullName: (_e = {},
                                            _e[Op.like] = "%".concat(search === null || search === void 0 ? void 0 : search.toLowerCase(), "%"),
                                            _e[Op.ne] = fullName,
                                            _e),
                                    },
                                ],
                                _c),
                            include: [
                                {
                                    model: Profile_picture,
                                    attributes: ["mediaFileId"],
                                },
                            ],
                            attributes: { exclude: ["password"] },
                            order: [["username", "ASC"]],
                        })];
                case 2:
                    filterUsers = _f.sent();
                    res.status(200).send(filterUsers);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _f.sent();
                    console.error(error_3);
                    res.status(500).send("Error searching for users");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.searchUser = searchUser;
function patchProfileImg(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var userId, file, profilePic, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                    file = req === null || req === void 0 ? void 0 : req.file;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, Profile_picture.findOne({
                            where: {
                                userId: userId,
                            },
                        })];
                case 2:
                    profilePic = _b.sent();
                    return [4 /*yield*/, (0, s3_1.uploadFile)(file)];
                case 3:
                    _b.sent();
                    if (!profilePic) return [3 /*break*/, 5];
                    return [4 /*yield*/, Profile_picture.update({
                            mediaFileId: file.filename,
                        }, {
                            where: {
                                userId: userId,
                            },
                        })];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, Profile_picture.create({
                        userId: userId,
                        mediaFileId: file.filename,
                    })];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7: return [4 /*yield*/, unlinkFile(file.path)];
                case 8:
                    _b.sent();
                    res
                        .status(201)
                        .send({ message: "Profile picture updated", avatar: file.filename });
                    return [3 /*break*/, 10];
                case 9:
                    error_4 = _b.sent();
                    (0, logger_1.accessLog)("PATCH Profile Picture Error", error_4);
                    return [2 /*return*/, res.status(400).send("No file uploaded")];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.patchProfileImg = patchProfileImg;
// get friends list
function getFriends(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var id, limit, followingUsers, error_5;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
                    limit = req.query.limit;
                    return [4 /*yield*/, Follower.findAll({
                            where: {
                                followerUserId: id,
                            },
                            limit: limit ? parseInt(limit) : 10,
                        })];
                case 1:
                    followingUsers = _b.sent();
                    return [4 /*yield*/, Promise.all(followingUsers.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var userDetails;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, getUserPostsAndStats_1.getUserDetails)(user.followingUserId)];
                                    case 1:
                                        userDetails = _a.sent();
                                        return [2 /*return*/, userDetails];
                                }
                            });
                        }); }))];
                case 2:
                    // map through the following users and get the user details
                    followingUsers = _b.sent();
                    res.status(201).send({ followingUsers: followingUsers });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _b.sent();
                    console.log(error_5);
                    (0, logger_1.accessLog)("GET Friends List Error", error_5);
                    res.status(400).send();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getFriends = getFriends;
