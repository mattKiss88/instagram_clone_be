const {
  Post,
  Post_media,
  User,
  Profile_picture,
  Follower,
  Post_likes,
  Comment,
  Filter,
} = require("../../models");
export const getUserDetails = async (userId: number) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    delete user.dataValues.password;

    const profilePic = await Profile_picture.findOne({
      where: { userId: userId },
    });

    const userPostList = await Post.findAll({
      where: { userId: userId },
    });

    const userPostListWithImg = await Promise.all(
      userPostList.map(async (post: any) => {
        const images = await Post_media.findAll({
          where: { postId: post.id },
        });

        const filter = await Filter.findOne({
          where: { id: images[0]?.filterId || null },
        });

        if (images[0]) images[0].filter = filter?.filterName || null;

        const likes = await Post_likes.findAll({
          where: { postId: post.id },
        });

        const comments = await Comment.findAll({
          where: { postId: post.id },
        });

        return {
          post: {
            ...post.dataValues,
            likeCount: likes?.length,
            commentCount: comments?.length,
          },
          images: images.map((image: any) => {
            return { ...image.dataValues, filter: image.filter || null };
          }),
        };
      })
    );

    const followers = await Follower.findAll({
      where: { followingUserId: userId },
    });

    const following = await Follower.findAll({
      where: { followerUserId: userId },
    });

    return {
      ...user.dataValues,
      posts: userPostListWithImg,
      followers: followers.length,
      following: following.length,
      avatar: profilePic?.mediaFileId ? profilePic?.mediaFileId : "default.png",
    };
  } catch (err) {
    throw err;
  }
};
