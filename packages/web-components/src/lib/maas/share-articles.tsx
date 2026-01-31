import { useLocation } from 'react-router-dom';
import { FacebookIcon,LinkedinIcon,InstagramIcon,XIcon } from '../ui/icons';
import { Button } from '../ui/button';

const socialsMedia = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: FacebookIcon,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: LinkedinIcon,
  },
  {
    id: 'x',
    name: 'X',
    icon: XIcon,
  },{
    id: 'instagram',
    name: 'Instagram',
    icon: InstagramIcon,
  }
];

type ShareArticlesProps = {
  title?: string;
}

export const ShareArticles = ({ title = '' }: ShareArticlesProps) => {
  const location = useLocation();

  const currentUrl = encodeURIComponent(window.location.origin + location.pathname);
  const shareTitle = encodeURIComponent(title);

  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
    x: `https://twitter.com/intent/tweet?url=${currentUrl}${title ? `&text=${shareTitle}` : ''}`,
    instagram: undefined, // Instagram doesn't support web URL sharing
  }

  return (
    <div className="flex flex-col gap-5">
      <h2
        className={
          'uppercase text-left font-body text-[13px] font-bold leading-4 text-black/50 tracking-[0.26px] transition-colors'
        }
      >
        Partager l’article
      </h2>
      <div className={'flex flex-row gap-3 items-center relative'}>
        {socialsMedia.map((social) => {
          if (!links[social.id as keyof typeof links]) return null;
          return (
            <Button
              variant={'link'}
              key={social.id}
              rel="noopener noreferrer"
              className="!bg-black rounded p-1 !size-7 flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label={`Share on ${social.name}`}
            >
              <a href={`${links[social.id as keyof typeof links]}`} target="_blank" rel="noopener noreferrer">
                <social.icon className="size-5 fill-white" />
              </a>

            </Button>
          );
        })}
      </div>
    </div>
  );
}

