import { Link } from 'react-router';

export interface Article {
    image: string;
    title: string;
    category: string;
    subcategory?: string;
    link: string;
}

interface ArticlesHighlightProps {
    articles: Article[];
}

interface ArticleCardProps {
    article: Article;
    featured?: boolean;
}

interface TagProps {
    label: string;
    variant?: 'accent' | 'default';
}

const Tag = ({ label, variant = 'default' }: TagProps) => {
    return (
        <div
            className={`flex h-6 items-center justify-center rounded border border-[#333] bg-black/70 px-2 backdrop-blur-md`}
        >
            <span
                className={`font-body text-[11px] leading-4 font-semibold tracking-[0.33px] uppercase ${variant === 'accent' ? 'text-brand-secondary' : 'text-white'} `}
            >
                {label}
            </span>
        </div>
    );
};

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
    return (
        <Link
            to={article.link}
            className={`group relative flex flex-col items-start justify-end overflow-hidden rounded-[12px] ${featured ? 'h-full min-w-0 flex-1 basis-0 px-6 py-5' : 'min-h-0 w-full min-w-0 flex-1 basis-0 p-5'} `}
        >
            {/* Background Image */}
            <img
                src={article.image}
                alt={article.title}
                className="absolute inset-0 h-full w-full rounded-[12px] object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 rounded-[12px] bg-gradient-to-b from-transparent from-40% to-black/70" />

            {/* Content */}
            <div className="relative flex w-full flex-col gap-1">
                {/* Tags */}
                <div className="flex flex-wrap items-start gap-0.5">
                    <Tag label={article.category} variant="accent" />
                    {article.subcategory && <Tag label={article.subcategory} />}
                </div>

                {/* Title */}
                <h3
                    className={`font-heading w-full font-semibold text-white ${
                        featured
                            ? 'text-2xl leading-[40px] tracking-[-0.85px] md:text-[34px]'
                            : 'line-clamp-2 text-lg leading-6 tracking-[-0.3px] md:text-[20px]'
                    } `}
                >
                    {article.title}
                </h3>
            </div>
        </Link>
    );
};

export const ArticlesHighlight = ({ articles }: ArticlesHighlightProps) => {
    if (!articles.length) return null;

    const [featured, ...rest] = articles;
    const gridArticles = rest.slice(0, 4);

    return (
        <section className="flex w-full items-center justify-center">
            <div className="container flex w-full items-center justify-center px-5 py-4 md:pt-5 md:pb-10 xl:px-0">
                <div className="flex h-[640px] w-full flex-col gap-3 md:h-[480px] md:flex-row md:gap-5">
                    {/* Featured Article (Top/Left) */}
                    <ArticleCard article={featured} featured />

                    {/* Grid Articles (Bottom/Right) */}
                    <div className="flex min-w-0 flex-1 basis-0 gap-3 md:gap-5">
                        {/* First Column */}
                        <div className="flex h-full min-w-0 flex-1 basis-0 flex-col gap-3 md:gap-5">
                            {gridArticles.slice(0, 2).map((article, index) => (
                                <ArticleCard key={index} article={article} />
                            ))}
                        </div>

                        {/* Second Column */}
                        <div className="flex h-full min-w-0 flex-1 basis-0 flex-col gap-3 md:gap-5">
                            {gridArticles.slice(2, 4).map((article, index) => (
                                <ArticleCard key={index + 2} article={article} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
