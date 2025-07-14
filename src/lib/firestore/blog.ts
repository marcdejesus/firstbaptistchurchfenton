import { BaseFirestoreService } from './base';
import { Timestamp } from 'firebase/firestore';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  authorId: string;
  authorName: string;
  status: 'draft' | 'published' | 'archived';
  featuredImageUrl?: string;
  tags: string[];
  categories: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  likes: number;
  comments?: BlogComment[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface BlogComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  parentCommentId?: string;
  replies?: BlogComment[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
  createdAt: Date;
}

export class BlogService extends BaseFirestoreService {
  constructor() {
    super('blog_posts');
  }

  async createPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'likes'>): Promise<string> {
    const data = {
      ...postData,
      viewCount: 0,
      likes: 0,
      publishedAt: postData.status === 'published' ? Timestamp.now() : undefined,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    return await this.create(data);
  }

  async getPostById(postId: string): Promise<BlogPost | null> {
    const post = await this.getById(postId);
    if (!post) return null;

    return this.formatPostData(post);
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await this.getAll({
      where: [['slug', '==', slug], ['status', '==', 'published']],
      limit: 1,
    });

    if (posts.length === 0) return null;
    return this.formatPostData(posts[0]);
  }

  async updatePost(postId: string, updates: Partial<BlogPost>): Promise<void> {
    const { id, createdAt, ...updateData } = updates;
    
    if (updates.status === 'published' && !updates.publishedAt) {
      updateData.publishedAt = new Date();
    }

    await this.update(postId, updateData);
  }

  async deletePost(postId: string): Promise<void> {
    await this.delete(postId);
  }

  async getPublishedPosts(options?: {
    limit?: number;
    category?: string;
    tag?: string;
    authorId?: string;
  }): Promise<BlogPost[]> {
    const whereConstraints: Array<[string, any, any]> = [['status', '==', 'published']];

    if (options?.category) {
      whereConstraints.push(['categories', 'array-contains', options.category]);
    }

    if (options?.tag) {
      whereConstraints.push(['tags', 'array-contains', options.tag]);
    }

    if (options?.authorId) {
      whereConstraints.push(['authorId', '==', options.authorId]);
    }

    const posts = await this.getAll({
      where: whereConstraints,
      orderBy: [['publishedAt', 'desc']],
      limit: options?.limit,
    });

    return posts.map(post => this.formatPostData(post));
  }

  async getAllPosts(status?: 'draft' | 'published' | 'archived'): Promise<BlogPost[]> {
    const whereConstraints: Array<[string, any, any]> = [];

    if (status) {
      whereConstraints.push(['status', '==', status]);
    }

    const posts = await this.getAll({
      where: whereConstraints.length > 0 ? whereConstraints : undefined,
      orderBy: [['updatedAt', 'desc']],
    });

    return posts.map(post => this.formatPostData(post));
  }

  async searchPosts(searchTerm: string): Promise<BlogPost[]> {
    const [titleResults, contentResults] = await Promise.all([
      this.getAll({
        where: [
          ['status', '==', 'published'],
          ['title', '>=', searchTerm],
          ['title', '<=', searchTerm + '\uf8ff']
        ],
        orderBy: [['title', 'asc']],
        limit: 10,
      }),
      this.getAll({
        where: [
          ['status', '==', 'published'],
          ['tags', 'array-contains-any', [searchTerm]]
        ],
        limit: 10,
      }),
    ]);

    const allResults = [...titleResults, ...contentResults];
    const uniqueResults = allResults.filter((post, index, array) => 
      array.findIndex(p => p.id === post.id) === index
    );

    return uniqueResults.map(post => this.formatPostData(post));
  }

  async incrementViewCount(postId: string): Promise<void> {
    const post = await this.getById(postId);
    if (post) {
      await this.update(postId, {
        viewCount: (post.viewCount || 0) + 1,
      });
    }
  }

  async toggleLike(postId: string, increment: boolean): Promise<void> {
    const post = await this.getById(postId);
    if (post) {
      const currentLikes = post.likes || 0;
      await this.update(postId, {
        likes: increment ? currentLikes + 1 : Math.max(0, currentLikes - 1),
      });
    }
  }

  async getFeaturedPosts(limit = 3): Promise<BlogPost[]> {
    const posts = await this.getAll({
      where: [['status', '==', 'published'], ['featuredImageUrl', '!=', null]],
      orderBy: [['publishedAt', 'desc']],
      limit,
    });

    return posts.map(post => this.formatPostData(post));
  }

  async getRecentPosts(limit = 5): Promise<BlogPost[]> {
    const posts = await this.getAll({
      where: [['status', '==', 'published']],
      orderBy: [['publishedAt', 'desc']],
      limit,
    });

    return posts.map(post => this.formatPostData(post));
  }

  async getRelatedPosts(postId: string, tags: string[], limit = 3): Promise<BlogPost[]> {
    if (tags.length === 0) return [];

    const posts = await this.getAll({
      where: [
        ['status', '==', 'published'],
        ['tags', 'array-contains-any', tags]
      ],
      orderBy: [['publishedAt', 'desc']],
      limit: limit + 1,
    });

    const relatedPosts = posts
      .filter(post => post.id !== postId)
      .slice(0, limit);

    return relatedPosts.map(post => this.formatPostData(post));
  }

  async getBlogStats(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    totalLikes: number;
  }> {
    const allPosts = await this.getAll();
    
    const stats = allPosts.reduce((acc, post) => {
      acc.totalPosts++;
      if (post.status === 'published') acc.publishedPosts++;
      if (post.status === 'draft') acc.draftPosts++;
      acc.totalViews += post.viewCount || 0;
      acc.totalLikes += post.likes || 0;
      return acc;
    }, {
      totalPosts: 0,
      publishedPosts: 0,
      draftPosts: 0,
      totalViews: 0,
      totalLikes: 0,
    });

    return stats;
  }

  private formatPostData(postData: any): BlogPost {
    return {
      id: postData.id,
      title: postData.title || '',
      content: postData.content || '',
      excerpt: postData.excerpt,
      slug: postData.slug || '',
      authorId: postData.authorId || '',
      authorName: postData.authorName || '',
      status: postData.status || 'draft',
      featuredImageUrl: postData.featuredImageUrl,
      tags: postData.tags || [],
      categories: postData.categories || [],
      viewCount: postData.viewCount || 0,
      likes: postData.likes || 0,
      seo: postData.seo,
      publishedAt: this.timestampToDate(postData.publishedAt) || undefined,
      createdAt: this.timestampToDate(postData.createdAt) || new Date(),
      updatedAt: this.timestampToDate(postData.updatedAt) || new Date(),
    };
  }
}

export class BlogCategoriesService extends BaseFirestoreService {
  constructor() {
    super('blog_categories');
  }

  async createCategory(categoryData: Omit<BlogCategory, 'id' | 'postCount' | 'createdAt'>): Promise<string> {
    const data = {
      ...categoryData,
      postCount: 0,
      createdAt: Timestamp.now(),
    };

    return await this.create(data);
  }

  async getAllCategories(): Promise<BlogCategory[]> {
    const categories = await this.getAll({
      orderBy: [['name', 'asc']],
    });

    return categories.map(cat => this.formatCategoryData(cat));
  }

  async updateCategoryPostCount(categorySlug: string): Promise<void> {
    const blogService = new BlogService();
    const posts = await blogService.getPublishedPosts({ category: categorySlug });
    
    const categories = await this.getAll({
      where: [['slug', '==', categorySlug]],
      limit: 1,
    });

    if (categories.length > 0) {
      await this.update(categories[0].id, {
        postCount: posts.length,
      });
    }
  }

  private formatCategoryData(categoryData: any): BlogCategory {
    return {
      id: categoryData.id,
      name: categoryData.name || '',
      slug: categoryData.slug || '',
      description: categoryData.description,
      color: categoryData.color,
      postCount: categoryData.postCount || 0,
      createdAt: this.timestampToDate(categoryData.createdAt) || new Date(),
    };
  }
}

export const blogService = new BlogService();
export const blogCategoriesService = new BlogCategoriesService();