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
exports.followUser = exports.getUser = void 0;
var _a = require("../../models"), Post = _a.Post, User = _a.User, Profile_picture = _a.Profile_picture, Follower = _a.Follower;
require("dotenv").config();
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, user, profilePic, posts, followers, following, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    id = req.params.id;
                    return [4 /*yield*/, User.findOne({
                            where: { id: id },
                        })];
                case 1:
                    user = _a.sent();
                    user = user.dataValues;
                    delete user.password;
                    return [4 /*yield*/, Profile_picture.findOne({
                            where: { userId: id },
                        })];
                case 2:
                    profilePic = _a.sent();
                    return [4 /*yield*/, Post.findAll({
                            where: { userId: id },
                        })];
                case 3:
                    posts = _a.sent();
                    return [4 /*yield*/, Follower.findAll({
                            where: { followerUserId: id },
                        })];
                case 4:
                    followers = _a.sent();
                    return [4 /*yield*/, Follower.findAll({
                            where: { followingUserId: id },
                        })];
                case 5:
                    following = _a.sent();
                    res.status(201).send({
                        user: __assign(__assign({}, user), { avatar: profilePic.mediaFileId, posts: posts.length, followers: followers.length, following: following.length }),
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.log(error_1);
                    res.status(400).send(error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.getUser = getUser;
function followUser(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var userObj, following, follow, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    userObj = req.user.user;
                    return [4 /*yield*/, Follower.findOne({
                            where: {
                                followerUserId: userObj === null || userObj === void 0 ? void 0 : userObj.id,
                                followingUserId: (_a = req.body) === null || _a === void 0 ? void 0 : _a.userId,
                            },
                        })];
                case 1:
                    following = _b.sent();
                    if (following) {
                        return [2 /*return*/, res.status(400).send("You are already following this user")];
                    }
                    return [4 /*yield*/, Follower.create({
                            followerUserId: userObj.id,
                            followingUserId: req.body.userId,
                            createdAt: new Date(),
                        })];
                case 2:
                    follow = _b.sent();
                    res.status(201).send({ follow: follow });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    console.log(error_2);
                    res.status(400).send(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.followUser = followUser;
