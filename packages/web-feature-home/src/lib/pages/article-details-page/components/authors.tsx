import { ArticleAuthor } from '@maas/web-components';

type AuthorProps = {
  image: string;
  name:string;
  description?:string;
}
export const Authors = ({ authors }: { authors: AuthorProps[] }) => {
  return (
    <div className="flex flex-col gap-5">
      <h2
        className={
          'uppercase text-left font-body text-[13px] font-bold leading-4 text-black/50 tracking-[0.26px] transition-colors'
        }
      >
        Un article de
      </h2>
      <div className={'flex flex-col gap-3'}>
        {authors.map((author, index) => (
          <ArticleAuthor
            key={index}
            imageSrc={author.image}
            name={author.name}
            description={author.description}
          />
        ))}
      </div>
    </div>
  );
};
