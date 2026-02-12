import { Link } from 'react-router-dom';

interface FooterLink {
    text: string;
    url: string;
}

interface FooterProps {
    logo?: {
        src: string;
        alt: string;
    };
    tagline?: string;
    subscribeLabel?: string;
    subscribeUrl?: string;
    recentArticles?: FooterLink[];
    categories?: FooterLink[][];
}

const Footer = ({
    logo = {
        src: '/logo-tangente-full.png',
        alt: 'Tangente',
    },
    tagline = 'www.tangente-mag.com est le site du magazine Tangente, consacré à la vulgarisation des mathématiques sous une forme ludique et culturelle.',
    subscribeLabel = "Je m'abonne",
    subscribeUrl = '/pricing',
    recentArticles = [
        { text: 'Voyage au cœur des mathématiques avec Michel Jardonnet', url: '#' },
        { text: "L'architecture : une perspective sur les maths", url: '#' },
        { text: 'Probabilités, modélisation et éruptions : les volcans décryptés par les maths', url: '#' },
        { text: 'Quand les nombres frappent fort, la science mathématique du baseball', url: '#' },
        { text: "L'architecture : une perspective sur les maths", url: '#' },
    ],
    categories = [
        [
            { text: 'Actualités', url: '#' },
            { text: 'Algèbre', url: '#' },
            { text: 'Analyse', url: '#' },
            { text: 'Arithmétique', url: '#' },
            { text: 'Article', url: '#' },
        ],
        [
            { text: 'Dossiers thématique', url: '#' },
            { text: 'Géométrie', url: '#' },
            { text: 'Histoire & Culture', url: '#' },
            { text: 'HS Kiosque', url: '#' },
            { text: 'Jeux & Défis', url: '#' },
        ],
        [
            { text: 'Les dossiers', url: '#' },
            { text: 'Maths faciles', url: '#' },
            { text: 'Notes de lecture', url: '#' },
            { text: 'Personnages célèbres', url: '#' },
            { text: 'Ressources', url: '#' },
        ],
        [
            { text: 'Tangente', url: '#' },
            { text: 'Magazines', url: '#' },
            { text: 'Thématiques', url: '#' },
            { text: 'Vidéos', url: '#' },
        ],
    ],
}: FooterProps) => {
    return (
        <section className="flex items-center justify-center bg-[#141414] px-5">
            <div className="container mx-auto flex flex-col gap-20 py-10">
                {/* Top Block - Logo, Tagline, Subscribe */}
                <div className="flex flex-col items-center gap-5">
                    <div className="h-14 w-[150px]">
                        <img src={logo.src} alt={logo.alt} className="h-full w-full object-contain" />
                    </div>
                    <p className="font-heading max-w-[596px] text-center text-2xl leading-[40px] font-semibold tracking-[-0.85px] text-white md:text-[34px]">
                        {tagline}
                    </p>
                    <Link
                        to={subscribeUrl}
                        className="bg-brand-primary font-body hover:bg-brand-primary/90 flex h-10 items-center justify-center gap-1 rounded px-4 py-2 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-white transition-colors"
                    >
                        {subscribeLabel}
                    </Link>
                </div>

                {/* Bottom Block - Links */}
                <div className="flex flex-col gap-5 md:flex-row">
                    {/* Recent Articles Column */}
                    <div className="flex w-full shrink-0 flex-col gap-4 pr-5 md:w-[228px]">
                        <h3 className="font-body text-[13px] leading-4 font-bold tracking-[0.26px] text-white uppercase">
                            Articles récents
                        </h3>
                        <div className="flex flex-col gap-2">
                            {recentArticles.map((link, index) => (
                                <Link
                                    key={index}
                                    to={link.url}
                                    className="font-body truncate text-[14px] leading-5 font-normal tracking-[-0.07px] text-white/70 transition-colors hover:text-white"
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Categories Columns */}
                    <div className="flex flex-1 flex-col gap-4">
                        <h3 className="font-body text-[13px] leading-4 font-bold tracking-[0.26px] text-white uppercase">
                            Catégories populaires
                        </h3>
                        <div className="flex flex-wrap gap-5">
                            {categories.map((column, colIndex) => (
                                <div key={colIndex} className="flex flex-1 flex-col gap-2">
                                    {column.map((link, linkIndex) => (
                                        <Link
                                            key={linkIndex}
                                            to={link.url}
                                            className="font-body truncate text-[14px] leading-5 font-normal tracking-[-0.07px] text-white/70 transition-colors hover:text-white"
                                        >
                                            {link.text}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Footer };
