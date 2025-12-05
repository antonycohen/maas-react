import { User } from '../users';
import { Image } from '../image';
import { Reaction } from '../reaction';

export type Post = {
  id: string | null;
  content: string | null;
  type: PostType | null;
  user: User | null;
  parent: Post | null;
  image: Image | null;
  video: Visibility | null;
  visibility: string | null;
  metadata: Record<string, string> | null;
  likesCount: number | null;
  commentsCount: number | null;
  sharesCount: number | null;
  publishedAt: Date | null;
  userReaction: Reaction | null;
};


export enum Visibility {
  PUBLIC = "PUBLIC",
}

export enum PostType {
  POST = "POST",
  REPOST = "REPOST",
  SHARE = "SHARE",
  QUOTE = "QUOTE",
}
