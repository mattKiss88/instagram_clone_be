import { Request, Response, NextFunction } from "express";
import { getUserDetails } from "../helpers/getUserPostsAndStats";
import { uploadFile, getFileStream } from "../helpers/s3";
import { IComment } from "./types";
const { Op } = require("sequelize");
// typescript ignore subsequent lines
const {
  Comment,

  Comment_likes,
  Post,
  Post_media,
} = require("../../models");
require("dotenv").config();

async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { post_id } = req.params;

    const { comment, commentRepliedToId } = req.body;

    const user_id: number = req?.user?.id;

    let post = await Comment.create({
      createdByUserId: user_id,
      postId: post_id,
      comment,
      commentRepliedToId,
    });

    res.status(201).send({
      ...post.dataValues,
    });
  } catch (error: unknown) {
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
    const user_id: number = req?.user?.id;

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
      comments.map(async (comment: IComment) => {
        const likeCount: number = await Comment_likes.count({
          where: { commentId: comment.id },
        });

        const liked = await Comment_likes.findOne({
          where: { commentId: comment.id, userId: user_id },
        });

        const userDetails = await getUserDetails(comment.createdByUserId);

        const subComments = await Promise.all(
          totalSubComments
            .filter(
              (subComment: IComment) =>
                subComment.commentRepliedToId === comment.id
            )
            .map(async (subComment: IComment) => {
              const subCommentUserDetails = await getUserDetails(
                subComment.createdByUserId
              );

              const subCommentLiked = await Comment_likes.findOne({
                raw: true,
                where: { commentId: subComment.id, userId: user_id },
              });

              const subCommentTotalLikes: number = await Comment_likes.count({
                where: { commentId: subComment.id },
              });

              return {
                ...subComment,
                liked: subCommentLiked === null ? false : true,
                likeCount: subCommentTotalLikes,
                user: {
                  ...subCommentUserDetails,
                },
              };
            })
        );

        return {
          ...comment,
          likeCount,
          liked: liked === null ? false : true,
          subCommentCount: subComments?.length,
          subComments,
          user: {
            ...userDetails,
          },
        };
      })
    );

    //  order comments by date

    comments.sort((a: IComment, b: IComment) => {
      return (new Date(b.createdAt) as any) - (new Date(a?.createdAt) as any);
    });

    res.status(200).send({
      comments,
    });
  } catch (error: unknown) {
    console.log(
      error,
      "******************************* GET COMMENTS ERROR **********************************"
    );
    res.status(400).send(error);
  }
}

async function toggleCommentLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { commentId } = req.body;
  const userId: number = req?.user?.id;

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
  const likeCount: number = await Comment_likes.count({
    where: { commentId },
  });
  res.status(200).send({ likeCount });
}

export { addComment, getCommentsByPostId, toggleCommentLike };
