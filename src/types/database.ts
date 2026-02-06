// Database types based on Supabase schema
export interface Category {
  id: number;
  created_at: string;
  name: string;
  icon_name: string | null;
  logo_url: string | null;
  description: string | null;
}

export interface Article {
  id: number;
  created_at: string;
  question: string;
  answer: string | null;
  category_id: number;
  media_type: string | null;
  media_url: string | null;
  media_title: string | null;
  media_description: string | null;
}

// Extended types for UI components
export interface CategoryWithCount extends Category {
  article_count: number;
}

export interface ArticleWithCategory extends Article {
  category: Category;
}

