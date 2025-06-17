import type { PaginatedApiQueryContext } from './types';

export interface Post {
  id: number;
  title: string;
}

/**
 * Fetches posts from JSONPlaceholder with given pagination params.
 */
export async function fetchPosts({ queryKey }: PaginatedApiQueryContext): Promise<Post[]> {
  const [, { page, limit }] = queryKey;
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  return res.json();
}

export interface CreatePostData {
  title: string;
  body: string;
  userId: number;
}

/**
 * Creates a new post via JSONPlaceholder API
 */
export async function createPost(postData: CreatePostData): Promise<Post> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  
  if (!res.ok) {
    throw new Error('Failed to create post');
  }
  
  return res.json();
}