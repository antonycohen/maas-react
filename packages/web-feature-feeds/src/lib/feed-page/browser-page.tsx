import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

import 'katex/dist/katex.min.css';

interface Article {
    article_id: number;
    article_title: string;
    article_subtitle: string;
    problem_number: number;
    problem_week: boolean;
    article_summary: string;
    article_highlight: string;
    article_content: string;
    article_illustration_url: string | null;
    file_url: string | null;
    article_keywords: string;
    article_author: string;
    article_type: string;
    article_section: string;
    article_references: string;
    article_order_in_section: number;
    article_difficulty_level: number;
    article_access_level: 'free' | 'logged_in' | 'subscribers' | null;
    article_creation_date: string | null;
    article_modification_date: string | null;
    article_folder: number | null;
    release_id: string;
}

interface Folder {
    folder_id: number;
    folder_title: string;
    folder_summary: string;
    folder_illustration_url: string | null;
    folder_order_in_release: number;
    folder_is_published: boolean;
    articles: Article[];
}

interface ReleaseData {
    release_id: string;
    release_number: string;
    release_title: string;
    release_description: string;
    release_illustration_url: string | null;
    release_illustration2_url: string | null;
    release_publication_date: string;
    release_creation_date: string | null;
    release_is_published: boolean;
    release_magazine_name: string;
    folders: Folder[];
    orphean_articles: Article[];
}

export const BrowserPage = () => {
    const [data, setData] = useState<ReleaseData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                setData(json);
                setError(null);
                setSelectedFolder(null);
                setSelectedArticle(null);
            } catch {
                setError('Invalid JSON file');
                setData(null);
            }
        };
        reader.readAsText(file);
    };

    const renderArticle = (article: Article) => (
        <div key={article.article_id} className="border-b border-gray-200 last:border-b-0">
            <button
                onClick={() => setSelectedArticle(article)}
                className={`w-full p-4 text-left transition-colors ${
                    selectedArticle?.article_id === article.article_id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
            >
                <div className="flex items-start gap-3">
                    {article.article_illustration_url && (
                        <img
                            src={article.article_illustration_url}
                            alt={article.article_title}
                            className="h-20 w-20 rounded object-cover shadow-sm"
                        />
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="line-clamp-2 font-semibold text-gray-900">{article.article_title}</h4>
                            {article.problem_number > 0 && (
                                <span className="flex-shrink-0 rounded bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                                    #{article.problem_number}
                                </span>
                            )}
                        </div>
                        {article.article_subtitle && (
                            <p className="mt-1 line-clamp-1 text-sm text-gray-600">{article.article_subtitle}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs">
                            <span className="font-medium text-gray-700">{article.article_author}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{article.article_type}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{article.article_section}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">
                                {'★'.repeat(article.article_difficulty_level)}
                                {'☆'.repeat(5 - article.article_difficulty_level)}
                            </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {article.problem_week && (
                                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                                    Problem of the Week
                                </span>
                            )}
                            {article.article_access_level && (
                                <span
                                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                                        article.article_access_level === 'free'
                                            ? 'bg-green-100 text-green-800'
                                            : article.article_access_level === 'logged_in'
                                              ? 'bg-yellow-100 text-yellow-800'
                                              : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {article.article_access_level === 'free'
                                        ? 'Free'
                                        : article.article_access_level === 'logged_in'
                                          ? 'Login Required'
                                          : 'Subscribers Only'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </button>
        </div>
    );

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white shadow-sm">
                <div className="p-4">
                    <div className="flex items-center gap-4">
                        <label className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                            Load JSON File
                            <input type="file" accept=".json" onChange={handleFileLoad} className="hidden" />
                        </label>
                        {data && (
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">{data.release_title}</h1>
                                <div className="mt-1 flex gap-3 text-sm text-gray-600">
                                    <span className="font-medium">{data.release_magazine_name}</span>
                                    <span>•</span>
                                    <span>Issue #{data.release_number}</span>
                                    <span>•</span>
                                    <span>ID: {data.release_id}</span>
                                    <span>•</span>
                                    <span>{new Date(data.release_publication_date).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span
                                        className={`rounded px-2 py-0.5 text-xs font-semibold ${
                                            data.release_is_published
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {data.release_is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
                </div>

                {/* Release Description */}
                {data && (
                    <div className="px-4 pb-4">
                        {data.release_description && (
                            <p className="mb-3 text-sm text-gray-700">{data.release_description}</p>
                        )}
                        <div className="flex gap-4">
                            {data.release_illustration_url && (
                                <img
                                    src={data.release_illustration_url}
                                    alt="Release cover"
                                    className="h-32 w-24 rounded object-cover shadow-sm"
                                />
                            )}
                            {data.release_illustration2_url && (
                                <img
                                    src={data.release_illustration2_url}
                                    alt="Release cover 2"
                                    className="h-32 w-24 rounded object-cover shadow-sm"
                                />
                            )}
                            <div className="flex gap-6 text-xs text-gray-500">
                                <div>
                                    <span className="font-semibold">Folders:</span> {data.folders.length}
                                </div>
                                <div>
                                    <span className="font-semibold">Total Articles:</span>{' '}
                                    {data.folders.reduce((sum, f) => sum + f.articles.length, 0) +
                                        data.orphean_articles.length}
                                </div>
                                {data.orphean_articles.length > 0 && (
                                    <div>
                                        <span className="font-semibold">Orphan Articles:</span>{' '}
                                        {data.orphean_articles.length}
                                    </div>
                                )}
                                {data.release_creation_date && (
                                    <div>
                                        <span className="font-semibold">Created:</span>{' '}
                                        {new Date(data.release_creation_date).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Folders */}
                {data && (
                    <div className="w-80 overflow-y-auto border-r border-gray-200 bg-white">
                        <div className="p-4">
                            <h2 className="mb-4 text-lg font-bold text-gray-900">Folders</h2>
                            <div className="space-y-2">
                                {data.folders.map((folder) => (
                                    <button
                                        key={folder.folder_id}
                                        onClick={() => {
                                            setSelectedFolder(folder.folder_id);
                                            setSelectedArticle(null);
                                        }}
                                        className={`w-full rounded p-3 text-left transition-colors ${
                                            selectedFolder === folder.folder_id
                                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                        } border`}
                                    >
                                        {folder.folder_illustration_url && (
                                            <img
                                                src={folder.folder_illustration_url}
                                                alt={folder.folder_title}
                                                className="mb-2 h-32 w-full rounded object-cover"
                                            />
                                        )}
                                        <div className="font-semibold text-gray-900">{folder.folder_title}</div>
                                        <div className="mt-1 line-clamp-2 text-sm text-gray-600">
                                            {folder.folder_summary}
                                        </div>
                                        <div className="mt-2 flex gap-2 text-xs text-gray-500">
                                            <span>
                                                {folder.articles.length} article
                                                {folder.articles.length !== 1 ? 's' : ''}
                                            </span>
                                            <span>•</span>
                                            <span>Order: {folder.folder_order_in_release}</span>
                                            {!folder.folder_is_published && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-yellow-600">Draft</span>
                                                </>
                                            )}
                                        </div>
                                    </button>
                                ))}
                                {data.orphean_articles.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setSelectedFolder(-1);
                                            setSelectedArticle(null);
                                        }}
                                        className={`w-full rounded p-3 text-left transition-colors ${
                                            selectedFolder === -1
                                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                        } border`}
                                    >
                                        <div className="font-semibold text-gray-900">Orphan Articles</div>
                                        <div className="mt-1 text-xs text-gray-500">Articles without a folder</div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {data.orphean_articles.length} article
                                            {data.orphean_articles.length !== 1 ? 's' : ''}
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Article List */}
                {data && selectedFolder !== null && (
                    <div className="w-96 overflow-y-auto border-r border-gray-200 bg-white">
                        <div className="p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Articles</h3>
                                {selectedFolder !== -1 &&
                                    (() => {
                                        const folder = data.folders.find((f) => f.folder_id === selectedFolder);
                                        return folder ? (
                                            <div className="mt-2 text-sm text-gray-600">
                                                <p className="line-clamp-2">{folder.folder_summary}</p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {folder.articles.length} article
                                                    {folder.articles.length !== 1 ? 's' : ''} in this folder
                                                </p>
                                            </div>
                                        ) : null;
                                    })()}
                            </div>
                            <div>
                                {selectedFolder === -1
                                    ? data.orphean_articles.map(renderArticle)
                                    : data.folders
                                          .find((f) => f.folder_id === selectedFolder)
                                          ?.articles.map(renderArticle)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Article Detail */}
                {selectedArticle && (
                    <div className="flex-1 overflow-y-auto bg-white">
                        <div className="mx-auto max-w-4xl p-8">
                            {selectedArticle.article_illustration_url && (
                                <img
                                    src={selectedArticle.article_illustration_url}
                                    alt={selectedArticle.article_title}
                                    className="mb-6 h-80 w-full rounded-lg object-cover shadow-md"
                                />
                            )}

                            <div className="mb-6">
                                <div className="mb-2 flex items-start justify-between gap-4">
                                    <h1 className="flex-1 text-4xl font-bold text-gray-900">
                                        {selectedArticle.article_title}
                                    </h1>
                                    {selectedArticle.problem_number > 0 && (
                                        <div className="flex-shrink-0 rounded-lg bg-purple-100 px-4 py-2 text-purple-800">
                                            <div className="text-xs font-semibold">Problem</div>
                                            <div className="text-2xl font-bold">#{selectedArticle.problem_number}</div>
                                        </div>
                                    )}
                                </div>
                                {selectedArticle.article_subtitle && (
                                    <h2 className="mb-4 text-xl text-gray-700">{selectedArticle.article_subtitle}</h2>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className="mb-6 flex flex-wrap gap-3 border-b pb-6">
                                <div className="rounded bg-gray-100 px-3 py-2 text-sm">
                                    <span className="text-gray-600">By:</span>{' '}
                                    <span className="font-semibold text-gray-900">
                                        {selectedArticle.article_author}
                                    </span>
                                </div>
                                <div className="rounded bg-gray-100 px-3 py-2 text-sm">
                                    <span className="text-gray-600">Type:</span>{' '}
                                    <span className="font-semibold text-gray-900">{selectedArticle.article_type}</span>
                                </div>
                                <div className="rounded bg-gray-100 px-3 py-2 text-sm">
                                    <span className="text-gray-600">Section:</span>{' '}
                                    <span className="font-semibold text-gray-900">
                                        {selectedArticle.article_section}
                                    </span>
                                </div>
                                <div className="rounded bg-gray-100 px-3 py-2 text-sm">
                                    <span className="text-gray-600">Difficulty:</span>{' '}
                                    <span className="font-semibold text-yellow-600">
                                        {'★'.repeat(selectedArticle.article_difficulty_level)}
                                        {'☆'.repeat(5 - selectedArticle.article_difficulty_level)}
                                    </span>
                                </div>
                                {selectedArticle.article_access_level && (
                                    <div
                                        className={`rounded px-3 py-2 text-sm font-semibold ${
                                            selectedArticle.article_access_level === 'free'
                                                ? 'bg-green-100 text-green-800'
                                                : selectedArticle.article_access_level === 'logged_in'
                                                  ? 'bg-yellow-100 text-yellow-800'
                                                  : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {selectedArticle.article_access_level === 'free'
                                            ? 'Free Access'
                                            : selectedArticle.article_access_level === 'logged_in'
                                              ? 'Login Required'
                                              : 'Subscribers Only'}
                                    </div>
                                )}
                                {selectedArticle.problem_week && (
                                    <div className="rounded bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-800">
                                        Problem of the Week
                                    </div>
                                )}
                            </div>

                            {/* Additional metadata */}
                            <div className="mb-6 flex gap-4 text-xs text-gray-500">
                                <div>
                                    <span className="font-semibold">Article ID:</span> {selectedArticle.article_id}
                                </div>
                                <div>
                                    <span className="font-semibold">Order:</span>{' '}
                                    {selectedArticle.article_order_in_section}
                                </div>
                                {selectedArticle.article_creation_date && (
                                    <div>
                                        <span className="font-semibold">Created:</span>{' '}
                                        {new Date(selectedArticle.article_creation_date).toLocaleString()}
                                    </div>
                                )}
                                {selectedArticle.article_modification_date && (
                                    <div>
                                        <span className="font-semibold">Modified:</span>{' '}
                                        {new Date(selectedArticle.article_modification_date).toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {selectedArticle.article_summary && (
                                <div className="mb-6 rounded-r border-l-4 border-blue-500 bg-blue-50 p-4">
                                    <h3 className="mb-2 font-bold text-blue-900">Summary</h3>
                                    <p className="text-gray-700">{selectedArticle.article_summary}</p>
                                </div>
                            )}

                            {selectedArticle.article_highlight && (
                                <blockquote className="mb-6 rounded-r border-l-4 border-gray-400 bg-gray-50 py-4 pr-4 pl-6 text-lg text-gray-700 italic">
                                    "{selectedArticle.article_highlight}"
                                </blockquote>
                            )}

                            <article className="prose prose-lg prose-gray prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-800 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-purple-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-img:rounded-lg prose-img:shadow-md prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-2 prose-td:border prose-td:border-gray-300 prose-td:p-2 mb-8 max-w-none">
                                <ReactMarkdown
                                    urlTransform={(url) => {
                                        if (url.startsWith('data:image/')) return url;
                                        return url;
                                    }}
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[
                                        rehypeKatex,
                                        rehypeRaw,
                                        [
                                            rehypeSanitize,
                                            {
                                                ...defaultSchema,
                                                attributes: {
                                                    ...defaultSchema.attributes,
                                                    // Allow KaTeX class names and styles
                                                    span: [
                                                        ...(defaultSchema.attributes?.span || []),
                                                        'className',
                                                        'style',
                                                    ],
                                                    div: [
                                                        ...(defaultSchema.attributes?.div || []),
                                                        'className',
                                                        'style',
                                                    ],
                                                },
                                            },
                                        ],
                                    ]}
                                >
                                    {selectedArticle.article_content}
                                </ReactMarkdown>
                            </article>

                            {selectedArticle.article_references && (
                                <div className="mt-8 border-t pt-6">
                                    <h3 className="mb-3 text-lg font-bold text-gray-900">References</h3>
                                    <div className="rounded bg-gray-50 p-4 text-sm text-gray-700">
                                        {selectedArticle.article_references}
                                    </div>
                                </div>
                            )}

                            {selectedArticle.article_keywords && (
                                <div className="mt-6">
                                    <h3 className="mb-3 text-lg font-bold text-gray-900">Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedArticle.article_keywords.split(',').map((keyword, i) => (
                                            <span
                                                key={i}
                                                className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800"
                                            >
                                                {keyword.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedArticle.file_url && (
                                <div className="mt-8 border-t pt-6">
                                    <a
                                        href={selectedArticle.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        Download PDF
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!data && (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p className="text-lg">Load a JSON file to browse the release</p>
                        </div>
                    </div>
                )}
                {data && selectedFolder === null && (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p className="text-lg">Select a folder to view articles</p>
                        </div>
                    </div>
                )}
                {data && selectedFolder !== null && !selectedArticle && (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p className="text-lg">Select an article to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
