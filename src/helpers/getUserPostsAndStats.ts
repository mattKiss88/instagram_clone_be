const {
  Post,
  Post_media,
  User,
  Profile_picture,
  Follower,
  Post_likes,
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

        return { post, images };
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
