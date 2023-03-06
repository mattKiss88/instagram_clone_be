import { Request, Response, NextFunction } from "express";
import { getUserDetails } from "../helpers/getUserPostsAndStats";
import { uploadFile, getFileStream } from "../helpers/s3";
import { UserRequest } from "./post";
const { Op } = require("sequelize");

const {
  Comment,
  User,
  Profile_picture,
  Comment_likes,
  Post,
  Post_media,
} = require("../../models");
require("dotenv").config();

async function addComment(req: UserRequest, res: Response, next: NextFunction) {
  try {
    const { post_id } = req.params;

    const { comment, commentRepliedToId } = req.body;

    const user_id = req.user.user.id;

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
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { post_id } = req.params;
    const user_id = req.user.user.id;

    console.log("userid 99999999999999999999999999999", user_id);

    let comments = await Comment.findAll({
      where: {
        postId: post_id,
        commentRepliedToId: {
          [Op.is]: null,
        },
      },
    });

    let totalSubComments = await Comment.findAll({
      where: {
        postId: post_id,
        commentRepliedToId: {
          [Op.not]: null,
        },
      },
    });

    comments = await Promise.all(
      comments.map(async (comment: any) => {
        const totalLikes = await Comment_likes.count({
          where: { commentId: comment.id },
        });

        const liked = await Comment_likes.findOne({
          where: { commentId: comment.id, userId: user_id },
        });

        const userDetails = await getUserDetails(comment.createdByUserId);

        const subComments = totalSubComments.filter(
          (subComment: any) => subComment.commentRepliedToId === comment.id
        );

        return {
          ...comment.dataValues,
          totalLikes,
          liked: liked === null ? false : true,
          subCommentCount: subComments?.length,
          subComments,
          user: {
            ...userDetails,
          },
        };
      })
    );
    res.status(200).send({
      comments,
    });
  } catch (error) {
    console.log(
      error,
      "******************************* GET COMMENTS ERROR **********************************"
    );
    res.status(400).send(error);
  }
}

async function toggleCommentLike(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  const { commentId } = req.body;
  const userId = req.user.user.id;

  const liked = await Comment_likes.findOne({
    where: { commentId, userId },
  });
  if (liked) {
    await Comment_likes.destroy({
      where: { commentId, userId },
    });
  } else {
    await Comment_likes.create({
      commentId,
      userId,
    });
  }
  const totalLikes = await Comment_likes.count({
    where: { commentId },
  });
  res.status(200).send({ totalLikes });
}

export { addComment, getCommentsByPostId, toggleCommentLike };
