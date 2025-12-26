import {
  ArticleAuthor,
  Badge,
  Separator,
  FacebookIcon,
  InstagramIcon,
  XIcon,
  ContentFeed,
} from '@maas/web-components';
import { fakeFeedItems } from '../mock';


export const ArticleDetailsPage = () => {
  //const {id} = useParams<{id: string}>();
  //TODO: fetch the articles by id
  const fakeAuthors = [
    {
      name: 'John Doe',
      description: 'Senior Writer at Maas Magazine',
      imageSrc: 'https://eu.ui-avatars.com/api/?name=John+Doe&size=250',
    },
    {
      name: 'Jane Smith',
      description: 'Editor-in-Chief at Maas Magazine',
      imageSrc: 'https://eu.ui-avatars.com/api/?name=Jane+Smith&size=250',
    }
  ]


  return (
    <section className={'container mx-auto py-10 space-y-10'}>
      <div className={'grid cols-2 md:cols-4'}>
        <aside
          className={'order-last md:order-first flex flex-col gap-8 max-w-xs'}
        >
          <h2
            className={
              'uppercase text-left font-body text-[13px] font-bold uppercase leading-4 text-black/50 tracking-[0.26px] transition-colors'
            }
          >
            Un article de
          </h2>
          <div className={'flex flex-col gap-5'}>
            {fakeAuthors?.map((author, index) => (
              <ArticleAuthor
                key={index}
                imageSrc={author.imageSrc}
                name={author.name}
                description={author.description}
              />
            ))}
          </div>
          <Separator />
          <h2
            className={
              'uppercase text-left font-body text-[13px] font-bold uppercase leading-4 text-black/50 tracking-[0.26px] transition-colors'
            }
          >
            Thématique
          </h2>
          <div className={'flex flex-row flex-wrap gap-3'}>
            <Badge
              variant={'outline'}
              className={'uppercase px-4 py-2 rounded-md'}
            >
              Théorème
            </Badge>
            <Badge
              variant={'outline'}
              className={'uppercase px-4 py-2 rounded-md'}
            >
              Démonstration
            </Badge>
            <Badge
              className={'uppercase px-4 py-2 rounded-md'}
              variant={'outline'}
            >
              Conjecture
            </Badge>
          </div>
          <Separator />
          <h2
            className={
              'uppercase text-left font-body text-[13px] font-bold uppercase leading-4 text-black/50 tracking-[0.26px] transition-colors'
            }
          >
            Partager l’article
          </h2>
          <div className={'flex flex-row gap-4 items-center '}>
            <FacebookIcon className={'size-8'} />
            <XIcon className={'size-7'} />
            <InstagramIcon className={'size-7'} />
          </div>
        </aside>
        <main className={'col-span-2 md:col-span-3'}></main>
        <div></div>
      </div>
      <div className="container mx-auto flex flex-col gap-5 pb-10 pt-5">
        <h2 className="font-heading text-[34px] font-semibold leading-[40px] tracking-[-0.85px]">
          Articles Similaires
        </h2>
        <ContentFeed items={fakeFeedItems} />
      </div>
    </section>
  );
}
