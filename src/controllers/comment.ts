import { Request, Response, NextFunction } from "express";
import { uploadFile, getFileStream } from "../helpers/s3";
const { Op } = require("sequelize");

const { Comment } = require("../../models");
require("dotenv").config();

async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { post_id } = req.params;

    const { user_id, comment, commentRepliedToId } = req.body;

    let post = await Comment.create({
      createdByUserId: user_id,
      postId: post_id,
      comment,
      commentRepliedToId,
    });

    res.status(201).send({
      ...post.dataValues,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

async function getCommentsByPostId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { post_id } = req.params;

    let comments = await Comment.findAll({
      where: {
        postId: post_id,
        commentRepliedToId: {
          [Op.is]: null,
        },
      },
    });

    let subComments = await Comment.findAll({
      where: {
        postId: post_id,
        commentRepliedToId: {
          [Op.not]: null,
        },
      },
    });

    comments = comments.map((comment: any) => {
      return {
        ...comment.dataValues,
        subComments: subComments.filter(
          (subComment: any) => subComment.commentRepliedToId === comment.id
        ),
      };
    });

    res.status(200).send({
      ...comments,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

export { addComment, getCommentsByPostId };
