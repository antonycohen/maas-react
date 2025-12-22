import { Link } from 'react-router-dom';

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
      className={`
        flex h-6 items-center justify-center rounded px-2
        backdrop-blur-md border border-[#333]
        bg-black/70
      `}
    >
      <span
        className={`
          font-body text-[11px] font-semibold uppercase leading-4 tracking-[0.33px]
          ${variant === 'accent' ? 'text-brand-secondary' : 'text-white'}
        `}
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
      className={`
        relative flex flex-col items-start justify-end overflow-hidden rounded-[12px] group
        ${featured ? 'flex-1 basis-0 min-w-0 h-full px-6 py-5' : 'flex-1 basis-0 min-h-0 min-w-0 w-full p-5'}
      `}
    >
      {/* Background Image */}
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-[12px]"
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
          className={`
            font-heading font-semibold text-white w-full
            ${featured
              ? 'text-[34px] leading-[40px] tracking-[-0.85px]'
              : 'text-[20px] leading-6 tracking-[-0.3px] line-clamp-2'
            }
          `}
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
      <div className="container flex w-full items-center justify-center px-0 pb-10 pt-5">
        <div className="flex h-[480px] w-full gap-5">
          {/* Featured Article (Left) - basis-0 grow */}
          <ArticleCard article={featured} featured />

          {/* Grid Articles (Right) - basis-0 grow */}
          <div className="flex flex-1 basis-0 min-w-0 gap-5">
            {/* First Column - basis-0 grow */}
            <div className="flex flex-1 basis-0 min-w-0 h-full flex-col gap-5">
              {gridArticles.slice(0, 2).map((article, index) => (
                <ArticleCard key={index} article={article} />
              ))}
            </div>

            {/* Second Column - basis-0 grow */}
            <div className="flex flex-1 basis-0 min-w-0 h-full flex-col gap-5">
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
