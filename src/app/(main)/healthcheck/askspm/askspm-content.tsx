"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Source {
  chunkId: string;
  keyword: string;
  content: string;
  pillar: string;
  category: string;
  score: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timing?: {
    embeddingMs: number;
    searchMs: number;
    llmMs: number;
    totalMs: number;
  };
  model?: {
    embedding: string;
    llm: string;
    provider: string;
  };
}

const sampleQuestions = [
  "What is a clawback policy?",
  "How do accelerators work?",
  "Best practices for quota setting",
  "What are SPIFF payments?",
  "Explain territory alignment",
];

export default function AskSPMContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/askspm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, topK: 5 }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        timing: data.timing,
        model: data.model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSources = (index: number) => {
    setExpandedSources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-[#FF8737] flex items-center justify-center text-xl font-bold text-white mx-auto mb-4">
              ASK
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#E2E8F0] mb-2">
              Ask<span className="text-[#FF8737]">SPM</span>
            </h1>
            <p className="text-sm text-[#94A3B8]">
              929 knowledge cards • Powered by RAG • The Toddfather&apos;s expertise
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#FF8737]/20">
            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#64748B] mb-6">Ask anything about SPM</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {sampleQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSubmit(q)}
                        className="px-4 py-2 text-sm rounded-full bg-[#FF8737]/10 text-[#FF8737] hover:bg-[#FF8737]/20 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.role === "user"
                          ? "bg-[#FF8737] text-white rounded-2xl rounded-tr-sm"
                          : "bg-[#334155] text-[#E2E8F0] rounded-2xl rounded-tl-sm"
                      } px-4 py-3`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>

                      {/* Sources for assistant messages */}
                      {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <button
                            onClick={() => toggleSources(index)}
                            className="text-xs text-[#94A3B8] hover:text-white flex items-center gap-1"
                          >
                            <span>{expandedSources.has(index) ? "▼" : "▶"}</span>
                            <span>{message.sources.length} sources</span>
                            {message.timing && (
                              <span className="ml-2 text-[#64748B]">
                                ({message.timing.totalMs}ms)
                              </span>
                            )}
                          </button>

                          {expandedSources.has(index) && (
                            <div className="mt-3 space-y-2">
                              {message.sources.map((source, sIndex) => (
                                <div
                                  key={sIndex}
                                  className="text-xs bg-[#1E293B] rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-[#FF8737]">
                                      {source.keyword}
                                    </span>
                                    <span className="text-[#64748B]">
                                      {source.pillar} / {source.category}
                                    </span>
                                    <span className="ml-auto text-[#64748B]">
                                      {(source.score * 100).toFixed(0)}% match
                                    </span>
                                  </div>
                                  <p className="text-[#94A3B8] line-clamp-2">
                                    {source.content}
                                  </p>
                                </div>
                              ))}

                              {message.model && (
                                <div className="text-xs text-[#64748B] mt-2">
                                  Model: {message.model.llm} ({message.model.provider})
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#334155] text-[#94A3B8] rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FF8737] rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-[#FF8737] rounded-full animate-pulse delay-75" />
                      <div className="w-2 h-2 bg-[#FF8737] rounded-full animate-pulse delay-150" />
                      <span className="ml-2 text-sm">Searching knowledge base...</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-center">
                  <div className="bg-red-500/10 text-red-400 rounded-lg px-4 py-2 text-sm">
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-[#FF8737]/10 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(input);
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about SPM, ICM, governance, quotas..."
                  className="flex-1 bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#FF8737] transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-6 py-3 bg-[#FF8737] text-white font-semibold rounded-lg hover:bg-[#FF8737]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "..." : "Ask"}
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <p className="text-[#64748B] text-sm text-center mt-6">
            Want your own AskSPM for your organization?{" "}
            <Link href="/toddfather/contact" className="text-[#FF8737] hover:underline">
              Contact The Toddfather
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
