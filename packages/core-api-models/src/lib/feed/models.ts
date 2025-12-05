import { User } from '../users';

export type FeedActivity = {
  id: string | null;
  user: User | null;
  actor: User | null;
  actionType: ActionTypeEnum | null;
};


export enum ActionTypeEnum {
  POST_CREATED = 'post_created',
  POST_SHARED = 'post_shared',
  POST_REPOSTED = 'post_reposted',
  POST_QUOTED = 'post_quoted',
  POST_REACTED = 'post_reacted',
  POST_COMMENTED = 'post_commented',
  USER_FOLLOWED = 'user_followed',
  GROUP_JOINED = 'group_joined',
  GROUP_POST_CREATED = 'group_post_created',
}
