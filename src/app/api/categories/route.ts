import { NextResponse } from 'next/server';

const categories = [
  {
    id: "1",
    name: "SRE Writer",
    description: "Panduan menggunakan SRE Writer untuk menulis konten",
    icon: "✍️",
    color: "#3b82f6",
    articleCount: 12
  },
  {
    id: "2", 
    name: "SRE Brain",
    description: "Panduan menggunakan SRE Brain untuk analisis dan insights",
    icon: "🧠",
    color: "#8b5cf6",
    articleCount: 8
  }
];

export async function GET() {
  return NextResponse.json(categories);
}
