import { Request, Response, NextFunction } from "express";
import { getUserDetails } from "../helpers/getUserPostsAndStats";
import { IComment } from "./types";
const { Op } = require("sequelize");
import { accessLog } from "../helpers/logger";
const { Comment, Comment_likes } = require("../../models");
require("dotenv").config();

async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { post_id } = req.params;
    const { comment, commentRepliedToId } = req.body;

    // Extract user_id from request user object (if available)
    const user_id: number = req?.user?.id;

    // Create comment
    let post = await Comment.create({
      createdByUserId: user_id,
      postId: post_id,
      comment,
      commentRepliedToId,
    });

    // Send success response with created comment data
    res.status(201).send({
      ...post.dataValues,
    });
  } catch (error: unknown) {
    // Catch and handle errors

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

    // Get comments that are not replies (i.e., comments with null commentRepliedToId)
    let comments = await Comment.findAll({
      raw: true,
      where: {
        postId: post_id,
        commentRepliedToId: {
          [Op.is]: null,
        },
      },
    });

    // Get total sub-comments (i.e., comments that are replies)
    let totalSubComments = await Comment.findAll({
      raw: true,
      where: {
        postId: post_id,
        commentRepliedToId: {
          [Op.not]: null,
        },
      },
    });

    // Process each comment to get additional details
    comments = await Promise.all(
      comments.map(async (comment: IComment) => {
        // Get like count for the comment
        const likeCount: number = await Comment_likes.count({
          where: { commentId: comment.id },
        });

        // Check if the comment is liked by the current user
        const liked = await Comment_likes.findOne({
          where: { commentId: comment.id, userId: user_id },
        });

        // Get user details of the comment creator
        const userDetails = await getUserDetails(comment.createdByUserId);

        // Get sub-comments (replies) for the comment
        const subComments = await Promise.all(
          totalSubComments
            .filter(
              (subComment: IComment) =>
                subComment.commentRepliedToId === comment.id
            )
            .map(async (subComment: IComment) => {
              // Get user details of the sub-comment creator
              const subCommentUserDetails = await getUserDetails(
                subComment.createdByUserId
              );

              // Check if the sub-comment is liked by the current user
              const subCommentLiked = await Comment_likes.findOne({
                raw: true,
                where: { commentId: subComment.id, userId: user_id },
              });

              // Get total likes count for the sub-comment
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

        // Return processed comment with additional details
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

    // Sort comments by date in descending order
    comments.sort((a: IComment, b: IComment) => {
      return (new Date(b.createdAt) as any) - (new Date(a?.createdAt) as any);
    });

    // Send success response with processed comments
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

async function toggleCommentLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { commentId } = req.body;

    // Extract userId from the authenticated user object in the request
    const userId: number = req.user.id;

    // Check if the user has already liked the comment
    const liked = await Comment_likes.findOne({
      where: { commentId, userId },
    });

    // If the user has already liked the comment, remove the like
    if (liked) {
      await Comment_likes.destroy({
        where: { commentId, userId },
      });
    }
    // If the user has not liked the comment, add a like
    else {
      await Comment_likes.create({
        commentId,
        userId,
      });
    }

    // Get the updated like count for the comment
    const likeCount: number = await Comment_likes.count({
      where: { commentId },
    });

    // Send a success response with the updated like count
    res.status(200).send({ likeCount });
  } catch (error: unknown) {
    console.log(
      error,
      "******************************* TOGGLE COMMENT LIKE ERROR **********************************"
    );
    res.status(400).send("Error toggling comment like");
  }
}

export { addComment, getCommentsByPostId, toggleCommentLike };
