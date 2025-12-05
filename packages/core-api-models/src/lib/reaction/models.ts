export type Reaction = {
  id: string | null;
  targetType: string | null;
  type: ReactionType | null;
}



export enum ReactionType {
  LIKE = "like",
  LOVE = "love",
  HAHA = "haha",
  WOW = "wow",
  SAD = "sad",
  ANGRY = "angry",
}
