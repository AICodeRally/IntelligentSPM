"use client";

import React, { use, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import blogData from "@/data/blog-posts.json";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
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
  Technology: "#0891B2",
};

// Simple markdown-like renderer for blog content
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactElement[] = [];
  let listItems: string[] = [];
  let inList = false;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-6 mb-6 space-y-2 text-[#94A3B8]">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Skip empty lines but flush lists
    if (!trimmed) {
      flushList();
      return;
    }

    // Bold headers like **Header**
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && !trimmed.includes("**", 2)) {
      flushList();
      const text = trimmed.slice(2, -2);
      elements.push(
        <h3 key={index} className="text-xl font-bold text-[#E2E8F0] mt-8 mb-4">
          {text}
        </h3>
      );
      return;
    }

    // List items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(trimmed.slice(2));
      return;
    }

    // Numbered list items
    if (/^\d+\.\s/.test(trimmed)) {
      flushList();
      const text = trimmed.replace(/^\d+\.\s/, "");
      elements.push(
        <p key={index} className="text-[#94A3B8] mb-2 pl-6">
          <span className="text-[#38BDF8] font-bold">{trimmed.match(/^\d+/)?.[0]}.</span> {renderInlineMarkdown(text)}
        </p>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={index} className="text-[#94A3B8] mb-4 leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
}

// Handle inline markdown (bold, italic, code)
function renderInlineMarkdown(text: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    // Italic
    const italicMatch = remaining.match(/\*([^*]+)\*/);
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/);

    const matches = [
      { match: boldMatch, type: "bold" },
      { match: italicMatch, type: "italic" },
      { match: codeMatch, type: "code" },
    ]
      .filter((m) => m.match)
      .sort((a, b) => (a.match?.index ?? Infinity) - (b.match?.index ?? Infinity));

    if (matches.length === 0 || !matches[0].match) {
      parts.push(remaining);
      break;
    }

    const firstMatch = matches[0];
    const matchObj = firstMatch.match!;
    const beforeText = remaining.slice(0, matchObj.index);
    if (beforeText) {
      parts.push(beforeText);
    }

    if (firstMatch.type === "bold") {
      parts.push(
        <strong key={keyIndex++} className="text-[#E2E8F0] font-semibold">
          {matchObj[1]}
        </strong>
      );
    } else if (firstMatch.type === "italic") {
      parts.push(
        <em key={keyIndex++} className="text-[#CBD5E1]">
          {matchObj[1]}
        </em>
      );
    } else if (firstMatch.type === "code") {
      parts.push(
        <code key={keyIndex++} className="bg-[#0F172A] px-2 py-0.5 rounded text-[#38BDF8] text-sm font-mono">
          {matchObj[1]}
        </code>
      );
    }

    remaining = remaining.slice((matchObj.index ?? 0) + matchObj[0].length);
  }

  return parts;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const posts = blogData.posts as BlogPost[];

  // Find current post
  const post = posts.find((p) => p.id === slug);

  // Get related posts (same category, excluding current)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => p.id !== post.id && p.category === post.category)
      .slice(0, 3);
  }, [posts, post]);

  // Get next/prev posts for navigation
  const currentIndex = posts.findIndex((p) => p.id === slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  if (!post) {
    notFound();
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  // Format view count
  const formatViews = (views: number) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Hero Header */}
      <section
        className="py-16 px-6 border-b border-[#1E293B]"
        style={{
          background: `linear-gradient(135deg, ${categoryColors[post.category] || "#38BDF8"}15, transparent)`,
        }}
      >
        <div className="max-w-3xl mx-auto">
          <Link
            href="/content/blog"
            className="text-[#64748B] hover:text-[#94A3B8] text-sm mb-6 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-3 py-1 text-sm font-bold rounded-full"
              style={{
                backgroundColor: `${categoryColors[post.category] || "#38BDF8"}20`,
                color: categoryColors[post.category] || "#38BDF8",
              }}
            >
              {post.category}
            </span>
            {post.featured && (
              <span className="px-3 py-1 text-sm font-bold rounded-full bg-[#38BDF8]/10 text-[#38BDF8]">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E2E8F0] mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-[#94A3B8] mb-8">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-[#64748B]">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#FF8737] flex items-center justify-center text-white font-bold">
                TF
              </div>
              <div>
                <p className="text-[#E2E8F0] font-medium">{post.author}</p>
                <p>{formatDate(post.publishedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {post.readTime} read
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {formatViews(post.views)} views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none">{renderContent(post.content)}</div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[#1E293B]">
              <p className="text-xs text-[#64748B] uppercase tracking-wider mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-[#1E293B] text-[#94A3B8] hover:text-white transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Post Navigation */}
      <section className="py-8 px-6 border-t border-[#1E293B]">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between gap-4">
            {prevPost ? (
              <Link href={`/content/blog/${prevPost.id}`} className="flex-1 group">
                <div className="bg-[#1E293B] rounded-xl p-5 border border-[#64748B]/20 hover:border-[#38BDF8]/30 transition-all">
                  <p className="text-xs text-[#64748B] mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </p>
                  <p className="text-[#E2E8F0] font-medium group-hover:text-[#38BDF8] transition-colors line-clamp-2">
                    {prevPost.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {nextPost ? (
              <Link href={`/content/blog/${nextPost.id}`} className="flex-1 group text-right">
                <div className="bg-[#1E293B] rounded-xl p-5 border border-[#64748B]/20 hover:border-[#38BDF8]/30 transition-all">
                  <p className="text-xs text-[#64748B] mb-2 flex items-center justify-end gap-1">
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </p>
                  <p className="text-[#E2E8F0] font-medium group-hover:text-[#38BDF8] transition-colors line-clamp-2">
                    {nextPost.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 px-6 border-t border-[#1E293B] bg-[#0F172A]/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#E2E8F0] mb-8">More in {post.category}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/content/blog/${related.id}`}>
                  <article className="group bg-[#1E293B] rounded-xl overflow-hidden border border-[#64748B]/20 hover:border-[#38BDF8]/30 transition-all cursor-pointer h-full flex flex-col">
                    <div
                      className="h-32 relative"
                      style={{
                        background: `linear-gradient(135deg, ${categoryColors[related.category] || "#38BDF8"}30, ${categoryColors[related.category] || "#38BDF8"}05)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold opacity-10 text-white">SPM</span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-[#E2E8F0] mb-2 group-hover:text-[#38BDF8] transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-[#94A3B8] flex-1 line-clamp-2">{related.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-[#64748B] mt-4 pt-4 border-t border-[#64748B]/10">
                        <span>{related.readTime}</span>
                        <span>{formatViews(related.views)} views</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscribe CTA */}
      <section className="py-16 px-6 border-t border-[#1E293B]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#E2E8F0] mb-4">Get more SPM insights</h2>
          <p className="text-[#94A3B8] mb-6">
            Join The Syndicate for weekly reality checks on sales compensation. No vendor spin, no consultant theater.
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
