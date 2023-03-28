// auth

export interface File {
  buffer: Buffer;
  originalname: string;
  filename: string | undefined;
  path: string;
}

// comment

export interface IComment {
  id: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: number;
  postId: number;
  commentRepliedToId: number | null;
  // user: User;
}

// post

export interface IPost {
  id: number;
  caption: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}

export interface IPost_media {
  id: number;
  postId: number;
  mediaFileId: string;
  position: number;
  filterId: number | null;
}

// user

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// filter

export interface IFilter {
  id: number;
  filterName: string;
  filterFileId: string;
  createdAt: Date;
  updatedAt: Date;
}

// comment likes

export interface IComment_likes {
  id: number;
  commentId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// post likes

export interface IPost_likes {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// follower

export interface IFollower {
  id: number;
  followerUserId: number;
  followingUserId: number;
  createdAt: Date;
  updatedAt: Date;
}

// profile picture

export interface IProfile_picture {
  id: number;
  userId: number;
  mediaFileId: string;
  createdAt: Date;
  updatedAt: Date;
}

// media file

export interface IMedia_file {
  id: number;
  mediaFileId: string;
  mediaFile: Buffer;

  createdAt: Date;
  updatedAt: Date;
}

// notification

export interface INotification {
  id: number;
  userId: number;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}
