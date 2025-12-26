import { Avatar, AvatarImage } from '../ui/avatar';

type ArticleAuthorProps = {
  name?: string;
  description?: string;
  imageSrc?: string;
}
export const ArticleAuthor = ({ imageSrc, name, description }: ArticleAuthorProps) => {
  return (
    <div className={'flex gap-3'}>
      <Avatar className={'size-12'}>
        <AvatarImage
          src={
            imageSrc || 'https://eu.ui-avatars.com/api/?name=John+Doe&size=250'
          }
        />
      </Avatar>
      <div>
        <h3 className={"font-body text-black font-semibold text-[14px] leading-[20px] tracking-[-0.07px]"}>{name}</h3>
        <p className={'font-body text-black/70 text-[13px] leading-[18px]'}>{description}</p>
      </div>
    </div>
  );
};
