import { FacebookIcon,LinkedinIcon,InstagramIcon,XIcon } from '../ui/icons';

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
  links?: {
    facebook?: string;
    linkedin?: string;
    x?: string;
    instagram?: string;
  };
}

export const ShareArticles = ({links}: ShareArticlesProps) => {

  if(!links) return null

  return (
    <div className="flex flex-col gap-5">
      <h2
        className={
          'uppercase text-left font-body text-[13px] font-bold leading-4 text-black/50 tracking-[0.26px] transition-colors'
        }
      >
        Partager l’article
      </h2>
      <div className={'flex flex-row gap-3 items-center'}>
        {socialsMedia.map((social) => {
          if (!links[social.id as keyof typeof links]) return null;
          return (
            <div key={social.id} className="bg-black rounded p-1 size-7 flex items-center justify-center text-white">
              <a
                href={links[social.id as keyof typeof links]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className={'size-5 text-white fill-white'} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

