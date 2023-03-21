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
        const likeCount = await Comment_likes.count({
          where: { commentId: comment.id },
        });

        const liked = await Comment_likes.findOne({
          where: { commentId: comment.id, userId: user_id },
        });

        const userDetails = await getUserDetails(comment.createdByUserId);

        const subComments = await Promise.all(
          totalSubComments
            .filter(
              (subComment: any) => subComment.commentRepliedToId === comment.id
            )
            .map(async (subComment: any) => {
              const subCommentUserDetails = await getUserDetails(
                subComment.createdByUserId
              );

              const subCommentLiked = await Comment_likes.findOne({
                where: { commentId: subComment.id, userId: user_id },
              });

              const subCommentTotalLikes = await Comment_likes.count({
                where: { commentId: subComment.id },
              });

              return {
                ...subComment.dataValues,
                liked: subCommentLiked === null ? false : true,
                likeCount: subCommentTotalLikes,
                user: {
                  ...subCommentUserDetails,
                },
              };
            })
        );

        return {
          ...comment.dataValues,
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

    comments.sort((a: any, b: any) => {
      return (new Date(b.createdAt) as any) - (new Date(a?.createdAt) as any);
    });

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
  const likeCount = await Comment_likes.count({
    where: { commentId },
  });
  res.status(200).send({ likeCount });
}

export { addComment, getCommentsByPostId, toggleCommentLike };
