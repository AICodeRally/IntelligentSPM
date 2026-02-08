/**
 * Blog Constants
 *
 * Shared types and constants for blog pages.
 */

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  image: string;
  views: number;
  featured: boolean;
  status: string;
  tags: string[];
};

export const categoryColors: Record<string, string> = {
  Foundation: "#38BDF8",
  Governance: "#A3E635",
  Legal: "#F472B6",
  "Deal Governance": "#FACC15",
  "Financial Controls": "#FB923C",
  "Performance Management": "#8B5CF6",
  Technology: "#0891B2",
};
