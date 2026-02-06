import { supabase } from './supabase'
import { Category, Article, CategoryWithCount, ArticleWithCategory } from '../types/database'

export class HelpdeskService {
  // Fetch all categories with article count
  static async getCategories(): Promise<CategoryWithCount[]> {
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        *,
        articles(count)
      `)
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return categories.map(category => ({
      ...category,
      article_count: category.articles?.[0]?.count || 0
    }))
  }

  // Fetch articles by category
  static async getArticlesByCategory(categoryId: number): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching articles:', error)
      return []
    }

    return data || []
  }

  // Search articles
  static async searchArticles(query: string): Promise<ArticleWithCategory[]> {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:categories(*)
      `)
      .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching articles:', error)
      return []
    }

    return data || []
  }

  // Get popular articles (most recent)
  static async getPopularArticles(limit: number = 5): Promise<ArticleWithCategory[]> {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular articles:', error)
      return []
    }

    return data || []
  }

  // Get single article by ID
  static async getArticleById(id: number): Promise<ArticleWithCategory | null> {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching article:', error)
      return null
    }

    return data
  }
}

