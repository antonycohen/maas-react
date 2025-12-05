import { Link } from 'react-router-dom';

export interface CategoryArticle {
  image: string;
  title: string;
  category: string;
  author: string;
  date: string;
  link: string;
}

interface CategoryArticleItemProps {
  article: CategoryArticle;
}

const CategoryArticleItem = ({ article }: CategoryArticleItemProps) => {
  return (
    <Link
      to={article.link}
      className="group flex gap-4 overflow-hidden rounded-lg  p-4 transition-colors"
    >
      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={article.image}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="mb-2 w-fit rounded bg-yellow-600 px-2 py-0.5 text-xs font-semibold uppercase text-white">
          {article.category}
        </span>
        <h3 className="mb-auto line-clamp-2 text-base font-semibold text-white">
          {article.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  );
};

interface CategoryArticlesProps {
  articles: CategoryArticle[];
}

export const CategoryArticles = ({ articles }: CategoryArticlesProps) => {
  if (!articles.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {articles.map((article, index) => (
        <CategoryArticleItem key={index} article={article} />
      ))}
    </div>
  );
};
