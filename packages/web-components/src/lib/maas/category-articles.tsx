import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';

export interface CategoryArticle {
    image: string;
    title: string;
    category: string;
    subcategory?: string;
    author: string;
    date: string;
    link: string;
    description?: string;
}

interface CategoryArticleItemProps {
    article: CategoryArticle;
}

interface CategoryTagProps {
    label: string;
    variant?: 'accent' | 'default';
}

const CategoryTag = ({ label, variant = 'default' }: CategoryTagProps) => {
    return (
        <div className="flex h-6 items-center justify-center rounded border border-[#333] bg-black/70 px-2 backdrop-blur-md">
            <span
                className={`font-body text-[11px] leading-4 font-semibold tracking-[0.33px] uppercase ${variant === 'accent' ? 'text-brand-secondary' : 'text-white'} `}
            >
                {label}
            </span>
        </div>
    );
};

const CategoryArticleItem = ({ article }: CategoryArticleItemProps) => {
    return (
        <Link
            to={article.link}
            className="group flex min-w-0 flex-1 basis-0 flex-col gap-3 rounded-[12px] border border-[#333] p-3 transition-colors hover:border-[#444] md:flex-row"
        >
            {/* Image */}
            <div className="relative aspect-[282/199] min-w-0 flex-1 overflow-hidden rounded md:basis-0">
                <img
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 basis-0 flex-col justify-between px-3 py-2">
                {/* Tags & Title */}
                <div className="flex flex-col gap-1">
                    {/* Tags */}
                    <div className="flex flex-wrap items-start gap-0.5">
                        <CategoryTag label={article.category} variant="accent" />
                        {article.subcategory && <CategoryTag label={article.subcategory} />}
                    </div>

                    {/* Title */}
                    <h3 className="font-heading line-clamp-3 h-20 text-[20px] leading-6 font-semibold tracking-[-0.3px] text-white">
                        {article.title}
                    </h3>
                    <p className="font-body m-0 line-clamp-3 text-[14px] leading-5 text-white/70">
                        {article.description}
                    </p>
                </div>

                {/* Author & Date */}
                <div className="mt-5 flex h-5 items-center justify-between gap-2 text-[13px] leading-[18px] text-white/70">
                    <span className="font-body max-w-40 font-semibold">{article.author}</span>
                    <span className="font-body font-normal">{article.date}</span>
                </div>
            </div>
        </Link>
    );
};

interface CategoryArticlesProps {
    articles: CategoryArticle[];
    viewAllLink?: string;
    viewAllLabel?: string;
}

export const CategoryArticles = ({ articles, viewAllLink, viewAllLabel = 'Voir tout' }: CategoryArticlesProps) => {
    if (!articles.length) return null;

    // Group articles into rows of 2
    const rows: CategoryArticle[][] = [];
    for (let i = 0; i < articles.length; i += 2) {
        rows.push(articles.slice(i, i + 2));
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Mobile Carousel */}
            <div className="md:hidden">
                <Carousel
                    opts={{
                        align: 'start',
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {articles.map((article, index) => (
                            <CarouselItem key={index} className="basis-[85%]">
                                <CategoryArticleItem article={article} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            {/* Desktop Grid */}
            <div className="hidden flex-col gap-5 md:flex">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-5">
                        {row.map((article, index) => (
                            <CategoryArticleItem key={index} article={article} />
                        ))}
                    </div>
                ))}
            </div>

            {/* View All Button */}
            {viewAllLink && (
                <div className="flex justify-center pt-5">
                    <Link
                        to={viewAllLink}
                        className="font-body inline-flex items-center justify-center gap-1 rounded border border-[#333] bg-[#141414] px-4 py-2 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-white transition-colors hover:border-[#444] hover:bg-[#1a1a1a]"
                    >
                        {viewAllLabel}
                    </Link>
                </div>
            )}
        </div>
    );
};
