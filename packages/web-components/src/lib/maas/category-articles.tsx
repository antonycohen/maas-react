import { Link } from 'react-router-dom';

export interface CategoryArticle {
  image: string;
  title: string;
  category: string;
  subcategory?: string;
  author: string;
  date: string;
  link: string;
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
    <div className="flex h-6 items-center justify-center rounded bg-black/70 border border-[#333] px-2 backdrop-blur-md">
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

const CategoryArticleItem = ({ article }: CategoryArticleItemProps) => {
  return (
    <Link
      to={article.link}
      className="group flex flex-1 basis-0 min-w-0 gap-3 rounded-[12px] border border-[#333] p-3 transition-colors hover:border-[#444]"
    >
      {/* Image */}
      <div className="relative flex-1 basis-0 min-w-0 aspect-[282/199] overflow-hidden rounded">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 basis-0 min-w-0 flex-col justify-between px-3 py-2">
        {/* Tags & Title */}
        <div className="flex flex-col gap-1">
          {/* Tags */}
          <div className="flex flex-wrap items-start gap-0.5">
            <CategoryTag label={article.category} variant="accent" />
            {article.subcategory && <CategoryTag label={article.subcategory} />}
          </div>

          {/* Title */}
          <h3 className="font-heading text-[20px] font-semibold leading-6 tracking-[-0.3px] text-white line-clamp-3">
            {article.title}
          </h3>
        </div>

        {/* Author & Date */}
        <div className="flex h-5 items-center gap-2 text-[13px] leading-[18px] text-white/70">
          <span className="font-body font-semibold">{article.author}</span>
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

export const CategoryArticles = ({
  articles,
  viewAllLink,
  viewAllLabel = 'Voir tout'
}: CategoryArticlesProps) => {
  if (!articles.length) return null;

  // Group articles into rows of 2
  const rows: CategoryArticle[][] = [];
  for (let i = 0; i < articles.length; i += 2) {
    rows.push(articles.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col gap-5">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-5">
          {row.map((article, index) => (
            <CategoryArticleItem key={index} article={article} />
          ))}
        </div>
      ))}

      {/* View All Button */}
      {viewAllLink && (
        <div className="flex justify-center pt-5">
          <Link
            to={viewAllLink}
            className="inline-flex items-center justify-center gap-1 rounded bg-[#141414] border border-[#333] px-4 py-2 font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-white transition-colors hover:bg-[#1a1a1a] hover:border-[#444]"
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </div>
  );
};
