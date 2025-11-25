import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Header from '@/components/Header';
import TableOfContents from '@/components/TableOfContents';

type Props = {
    params: Promise<{
        series: string;
        day: string;
    }>;
};

async function getArticle(series: string, day: string) {
    try {
        const filePath = path.join(
            process.cwd(),
            'src',
            'content',
            'advent',
            series,
            `${day}.mdx`
        );

        if (!fs.existsSync(filePath)) {
            return null;
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        return {
            metadata: data,
            content,
        };
    } catch (error) {
        console.error('Error loading article:', error);
        return null;
    }
}

export default async function ArticlePage({ params }: Props) {
    const { series, day } = await params;
    const article = await getArticle(series, day);

    if (!article) {
        notFound();
    }

    return (
        <>
            <Header />
            <div className="mx-auto max-w-7xl px-4 pt-8 pb-8">
                <div className="flex gap-8">
                    {/* メインコンテンツ */}
                    <main className="flex-1 min-w-0">
                        <article className="prose prose-lg max-w-none">
                            {/* メタデータ表示 */}
                            <div className="mb-8 pb-4 border-b border-gray-200">
                                <p className="text-sm text-gray-500 mb-2">
                                    {series === 'series1' ? 'シリーズ1' : 'シリーズ2'} - Day {day}
                                </p>
                                {article.metadata.author && (
                                    <p className="text-sm text-gray-600">
                                        著者: {article.metadata.author}
                                    </p>
                                )}
                                {article.metadata.date && (
                                    <p className="text-sm text-gray-600">
                                        日付: {article.metadata.date}
                                    </p>
                                )}
                            </div>

                            {/* MDXコンテンツ */}
                            <MDXRemote
                                source={article.content}
                                options={{
                                    mdxOptions: {
                                        remarkPlugins: [remarkMath],
                                        rehypePlugins: [rehypeKatex],
                                    },
                                }}
                            />
                        </article>

                        {/* 戻るボタン */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <a
                                href="/"
                                className="inline-block px-6 py-3 bg-[#444443] text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                ← カレンダーに戻る
                            </a>
                        </div>
                    </main>

                    {/* 右側：目次 */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <TableOfContents />
                    </aside>
                </div>
            </div>
        </>
    );
}
