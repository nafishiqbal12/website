import type { ComponentType } from 'react';

type PostModuleProps = Record<string, unknown>;

type PostModule = {
  default: ComponentType<PostModuleProps>;
  frontmatter: {
    title: string;
    description?: string;
    slug: string;
    publishedAt: string;
    updatedAt?: string;
    tags?: string[];
    coverImage?: string;
    author?: string;
    readingTime?: string;
  };
};

export type Post = {
  title: string;
  description?: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  coverImage?: string;
  author?: string;
  readingTime?: string;
  Component: ComponentType<PostModuleProps>;
};

// Vite: import all MDX modules eagerly
const modules = import.meta.glob(
  '../content/blog/*.mdx',
  { eager: true }
) as Record<string, PostModule>;

export function getAllPosts(): Post[] {
  const posts: Post[] = Object.values(modules)
    .map((m) => {
      const fm = m.frontmatter || ((m as unknown) as Record<string, unknown>).meta || {};
      return {
        title: fm.title,
        description: fm.description,
        slug: fm.slug,
        publishedAt: fm.publishedAt,
        updatedAt: fm.updatedAt || fm.publishedAt,
        tags: fm.tags || [],
        coverImage: fm.coverImage,
        author: fm.author,
        readingTime: fm.readingTime,
        Component: m.default,
      } as Post;
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
