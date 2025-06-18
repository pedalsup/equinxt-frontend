import { axiosRequest, getConfig } from './axios';
import type { PaginatedApiQueryContext } from './types';

export interface Post {
  id: number;
  title: string;
  body?: string;
  userId?: number;
}

/**
 * Fetches posts from JSONPlaceholder with given pagination params.
 */
export async function fetchPosts({ queryKey }: PaginatedApiQueryContext): Promise<Post[]> {
  const [, { page, limit }] = queryKey;
  const config = getConfig('GET', '/posts', undefined, {
    _page: page,
    _limit: limit,
  });
  const response = await axiosRequest<Post[]>(config);
  return response.data;
}

/**
 * Fetches a single post by ID
 */
export async function fetchPostById(id: number): Promise<Post> {
  const config = getConfig('GET', `/posts/${id}`);
  const response = await axiosRequest<Post>(config);
  return response.data;
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
  const config = getConfig('POST', '/posts', postData);
  const response = await axiosRequest<Post>(config);
  return response.data;
}

export interface UpdatePostData {
  title?: string;
  body?: string;
  userId?: number;
}

/**
 * Updates an existing post via JSONPlaceholder API
 */
export async function updatePost(id: number, postData: UpdatePostData): Promise<Post> {
  const config = getConfig('PUT', `/posts/${id}`, postData);
  const response = await axiosRequest<Post>(config);
  return response.data;
}

/**
 * Partially updates an existing post via JSONPlaceholder API
 */
export async function patchPost(id: number, postData: Partial<UpdatePostData>): Promise<Post> {
  const config = getConfig('PATCH', `/posts/${id}`, postData);
  const response = await axiosRequest<Post>(config);
  return response.data;
}

/**
 * Deletes a post via JSONPlaceholder API
 */
export async function deletePost(id: number): Promise<void> {
  const config = getConfig('DELETE', `/posts/${id}`);
  await axiosRequest<void>(config);
}

/**
 * Fetches posts by user ID
 */
export async function fetchPostsByUserId(userId: number): Promise<Post[]> {
  const config = getConfig('GET', '/posts', undefined, { userId });
  const response = await axiosRequest<Post[]>(config);
  return response.data;
}