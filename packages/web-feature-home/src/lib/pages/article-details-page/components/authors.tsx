import { ArticleAuthor } from '@maas/web-components';
import { Article } from '@maas/core-api-models';
import { getImageUrl } from '@maas/core-utils';

type AuthorProps = Article['author']
export const Authors = ({ authors }: { authors: AuthorProps[] }) => {

  const filteredAuthors = authors.filter(author => author !== null && author !== undefined);
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
        {filteredAuthors.map((author, index) => (
          <ArticleAuthor
            key={index}
            imageSrc={getImageUrl(author.profileImage, 48, 48, 'cropped', '')}
            name={`${author.firstName} ${author.lastName}`}
            description={author.bio ?? ''}
          />
        ))}
      </div>
    </div>
  );
};
