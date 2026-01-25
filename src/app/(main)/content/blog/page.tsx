"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import blogData from "@/data/blog-posts.json";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
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

// Category colors
const categoryColors: Record<string, string> = {
  Foundation: "#38BDF8",
  Governance: "#A3E635",
  Legal: "#F472B6",
  "Deal Governance": "#FACC15",
  "Financial Controls": "#FB923C",
  "Performance Management": "#8B5CF6",
};

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const posts = blogData.posts as BlogPost[];
  const categories = blogData.categories;

  // Filter posts
  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  // Featured posts
  const featuredPosts = posts.filter((p) => p.featured);

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Format view count
  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Hero with Featured Post */}
      {featuredPosts.length > 0 && !selectedCategory && (
        <section className="px-6 pt-12">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#38BDF8] mb-6">
              Featured
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <Link key={post.id} href={`/content/blog/${post.id}`}>
                  <div className="group relative bg-[#1E293B] rounded-2xl overflow-hidden border border-[#38BDF8]/20 hover:border-[#38BDF8]/50 transition-all cursor-pointer h-full">
                    {/* Image placeholder - gradient background */}
                    <div
                      className="h-48 relative"
                      style={{
                        background: `linear-gradient(135deg, ${categoryColors[post.category] || "#38BDF8"}40, ${categoryColors[post.category] || "#38BDF8"}10)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-20">SPM</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span
                          className="px-3 py-1 text-xs font-bold rounded-full"
                          style={{
                            backgroundColor: `${categoryColors[post.category] || "#38BDF8"}20`,
                            color: categoryColors[post.category] || "#38BDF8",
                          }}
                        >
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-[#E2E8F0] mb-2 group-hover:text-[#38BDF8] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-[#94A3B8] text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-[#64748B]">
                        <span>{formatDate(post.publishedAt)}</span>
                        <div className="flex items-center gap-4">
                          <span>{post.readTime}</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {formatViews(post.views)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Header & Filters */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-2">
                {selectedCategory ? selectedCategory : "All Posts"}
              </h1>
              <p className="text-[#94A3B8]">
                SPM reality from The Toddfather. No vendor spin, no consultant theater.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-[#38BDF8] text-[#0F172A]"
                    : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-[#38BDF8] text-[#0F172A]"
                    : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? "bg-white text-[#0F172A]"
                  : "bg-[#1E293B] text-[#94A3B8] hover:text-white"
              }`}
            >
              All ({posts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  selectedCategory === cat.name
                    ? "text-white"
                    : "text-[#94A3B8] hover:text-white"
                }`}
                style={{
                  backgroundColor: selectedCategory === cat.name ? cat.color : "transparent",
                  borderColor: `${cat.color}40`,
                }}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {viewMode === "grid" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/content/blog/${post.id}`}>
                  <article className="group bg-[#1E293B] rounded-xl overflow-hidden border border-[#64748B]/20 hover:border-[#38BDF8]/30 transition-all cursor-pointer h-full flex flex-col">
                    {/* Image placeholder */}
                    <div
                      className="h-40 relative"
                      style={{
                        background: `linear-gradient(135deg, ${categoryColors[post.category] || "#38BDF8"}30, ${categoryColors[post.category] || "#38BDF8"}05)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold opacity-10 text-white">SPM</span>
                      </div>
                      {post.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 text-xs font-bold rounded bg-[#38BDF8] text-[#0F172A]">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="px-2 py-0.5 text-xs font-bold rounded"
                          style={{
                            backgroundColor: `${categoryColors[post.category] || "#38BDF8"}20`,
                            color: categoryColors[post.category] || "#38BDF8",
                          }}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-[#64748B]">{post.readTime}</span>
                      </div>
                      <h3 className="font-bold text-[#E2E8F0] mb-2 group-hover:text-[#38BDF8] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#94A3B8] mb-4 flex-1 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-[#64748B] mt-auto pt-4 border-t border-[#64748B]/10">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {formatViews(post.views)} views
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/content/blog/${post.id}`}>
                  <article className="group bg-[#1E293B] rounded-xl p-5 border border-[#64748B]/20 hover:border-[#38BDF8]/30 transition-all cursor-pointer flex gap-6">
                    {/* Mini image */}
                    <div
                      className="w-24 h-24 rounded-lg shrink-0 flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${categoryColors[post.category] || "#38BDF8"}30, ${categoryColors[post.category] || "#38BDF8"}05)`,
                      }}
                    >
                      <span className="text-2xl font-bold opacity-20 text-white">SPM</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2 py-0.5 text-xs font-bold rounded"
                          style={{
                            backgroundColor: `${categoryColors[post.category] || "#38BDF8"}20`,
                            color: categoryColors[post.category] || "#38BDF8",
                          }}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-[#64748B]">{post.readTime}</span>
                        {post.featured && (
                          <span className="px-2 py-0.5 text-xs font-bold rounded bg-[#38BDF8]/10 text-[#38BDF8]">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-[#E2E8F0] mb-1 group-hover:text-[#38BDF8] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#94A3B8] line-clamp-1">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-[#64748B] mt-3">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {formatViews(post.views)} views
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 px-6 border-t border-[#1E293B]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#E2E8F0] mb-4">Get new posts first</h2>
          <p className="text-[#94A3B8] mb-6">
            Join The Syndicate for weekly SPM insights, no fluff.
          </p>
          <Link href="/syndicate">
            <button className="px-8 py-4 rounded-xl text-white font-bold bg-[#FF8737] hover:bg-[#FF8737]/90 transition-all hover:scale-105">
              Join The Syndicate
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
