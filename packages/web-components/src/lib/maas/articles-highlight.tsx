import { Link } from 'react-router-dom';

export interface Article {
  image: string;
  title: string;
  category: string;
  link: string;
}

interface ArticlesHighlightProps {
  articles: Article[];
}

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  return (
    <Link
      to={article.link}
      className={`relative block overflow-hidden rounded-lg group ${
        featured ? 'h-full min-h-[400px]' : 'h-48'
      }`}
    >
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <span className="mb-2 w-fit rounded bg-yellow-400 px-2 py-0.5 text-xs font-semibold uppercase text-black">
          {article.category}
        </span>
        <h3
          className={`font-semibold text-white ${
            featured ? 'text-2xl' : 'text-base'
          }`}
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ArticleCard article={featured} featured />
      <div className="grid grid-cols-2 gap-4">
        {gridArticles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};
