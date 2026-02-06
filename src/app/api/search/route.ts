import { NextRequest, NextResponse } from 'next/server';

const articles = [
  {
    id: "1",
    title: "Cara membuat artikel baru di SRE Writer",
    content: "Panduan lengkap membuat artikel baru menggunakan SRE Writer dengan fitur-fitur yang tersedia.",
    categoryId: "1",
    views: 1250,
    helpful: 89,
    tags: ["sre-writer", "artikel", "konten"]
  },
  {
    id: "2", 
    title: "Mengedit konten di SRE Writer",
    content: "Langkah-langkah untuk mengedit dan memperbaiki konten yang sudah ada di SRE Writer.",
    categoryId: "1",
    views: 980,
    helpful: 76,
    tags: ["sre-writer", "edit", "konten"]
  },
  {
    id: "3",
    title: "Analisis data dengan SRE Brain",
    content: "Cara melakukan analisis data menggunakan fitur SRE Brain untuk mendapatkan insights.",
    categoryId: "2",
    views: 750,
    helpful: 65,
    tags: ["sre-brain", "analisis", "data"]
  },
  {
    id: "4",
    title: "Dashboard insights SRE Brain",
    content: "Panduan menggunakan dashboard insights untuk monitoring dan visualisasi data.",
    categoryId: "2",
    views: 650,
    helpful: 58,
    tags: ["sre-brain", "dashboard", "insights"]
  },
  {
    id: "5",
    title: "Format penulisan di SRE Writer",
    content: "Panduan format dan struktur penulisan yang baik untuk konten yang efektif.",
    categoryId: "1",
    views: 580,
    helpful: 45,
    tags: ["sre-writer", "format", "penulisan"]
  },
  {
    id: "6",
    title: "Integrasi data SRE Brain",
    content: "Cara mengintegrasikan data dari berbagai sumber ke dalam SRE Brain.",
    categoryId: "2",
    views: 420,
    helpful: 38,
    tags: ["sre-brain", "integrasi", "data"]
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const categoryId = searchParams.get('category');

  let filteredArticles = articles;

  // Filter by search query
  if (query) {
    const searchTerm = query.toLowerCase();
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Filter by category
  if (categoryId) {
    filteredArticles = filteredArticles.filter(article => 
      article.categoryId === categoryId
    );
  }

  // Sort by views (most popular first)
  filteredArticles.sort((a, b) => b.views - a.views);

  return NextResponse.json(filteredArticles);
}
