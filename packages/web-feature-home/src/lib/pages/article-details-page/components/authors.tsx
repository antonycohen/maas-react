import { ArticleAuthor, Separator } from '@maas/web-components';
import { Article } from '@maas/core-api-models';
import { getImageUrl } from '@maas/core-utils';
import { useTranslation } from '@maas/core-translations';

type AuthorProps = Article['author'];
export const Authors = ({ authors, withSeparator = true }: { authors: AuthorProps[]; withSeparator?: boolean }) => {
    const { t } = useTranslation();
    const filteredAuthors = authors.filter((author) => author !== null && author !== undefined);
    if (filteredAuthors.length === 0) return null;
    return (
        <>
            <div className="flex flex-col gap-5">
                <h2
                    className={
                        'font-body text-left text-[13px] leading-4 font-bold tracking-[0.26px] text-black/50 uppercase transition-colors'
                    }
                >
                    {t('home.articleBy')}
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
            {withSeparator && <Separator />}
        </>
    );
};
