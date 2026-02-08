"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
    embeddingMs?: number;
    libraryMs?: number;
    searchMs?: number;
    llmMs?: number;
    totalMs?: number;
  };
  model?: {
    embedding: string;
    llm: string;
    provider: string;
  };
  queryId?: string;
  libraryAnswerId?: string;
  fromLibrary?: boolean;
  feedbackGiven?: "thumbs_up" | "thumbs_down";
}

interface SSEEvent {
  type: "metadata" | "content" | "done" | "error";
  data: Record<string, unknown>;
}

const sampleQuestions = [
  "What is a clawback policy?",
  "How do accelerators work?",
  "Best practices for quota setting",
  "What are SPIFF payments?",
  "Explain territory alignment",
];

/**
 * Parse SSE events from raw text
 */
function parseSSEEvents(text: string): SSEEvent[] {
  const events: SSEEvent[] = [];
  const lines = text.split("\n");
  let currentEvent: Partial<SSEEvent> = {};

  for (const line of lines) {
    if (line.startsWith("event: ")) {
      currentEvent.type = line.slice(7).trim() as SSEEvent["type"];
    } else if (line.startsWith("data: ")) {
      try {
        currentEvent.data = JSON.parse(line.slice(6));
      } catch {
        // Skip malformed JSON
      }
    } else if (line === "" && currentEvent.type && currentEvent.data) {
      events.push(currentEvent as SSEEvent);
      currentEvent = {};
    }
  }

  return events;
}

export default function AskSPMContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load session token on mount
  useEffect(() => {
    const stored = localStorage.getItem("askspm_session");
    if (stored) {
      setSessionToken(stored);
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /**
   * Handle streaming submission
   */
  const handleStreamingSubmit = async (query: string) => {
    if (!query.trim() || isStreaming) return;

    // Add user message immediately
    const userMessage: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);
    setStreamingStatus("Connecting...");
    setError(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/askspm/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          topK: 5,
          sessionToken,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      const assistantMessage: Message = {
        role: "assistant",
        content: "",
      };

      // Add placeholder for streaming message
      setMessages((prev) => [...prev, { ...assistantMessage }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = parseSSEEvents(buffer);

        // Keep any incomplete event data in buffer
        const lastNewline = buffer.lastIndexOf("\n\n");
        if (lastNewline !== -1) {
          buffer = buffer.slice(lastNewline + 2);
        }

        for (const event of events) {
          if (event.type === "metadata") {
            const data = event.data;
            if (data.status) {
              const statusMap: Record<string, string> = {
                embedding: "Understanding question...",
                searching: "Searching knowledge base...",
                generating: "Generating response...",
              };
              setStreamingStatus(statusMap[data.status as string] || "Processing...");
            }
            if (data.sources) {
              assistantMessage.sources = data.sources as Source[];
            }
            if (data.fromLibrary !== undefined) {
              assistantMessage.fromLibrary = data.fromLibrary as boolean;
            }
            if (data.libraryAnswerId) {
              assistantMessage.libraryAnswerId = data.libraryAnswerId as string;
            }
            if (data.timing) {
              assistantMessage.timing = {
                ...assistantMessage.timing,
                ...(data.timing as Message["timing"]),
              };
            }
          } else if (event.type === "content") {
            assistantMessage.content += (event.data.content as string) || "";
            // Update UI with partial content
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { ...assistantMessage },
            ]);
          } else if (event.type === "done") {
            const data = event.data;
            if (data.queryId) {
              assistantMessage.queryId = data.queryId as string;
            }
            if (data.timing) {
              assistantMessage.timing = data.timing as Message["timing"];
            }
            if (data.model) {
              assistantMessage.model = data.model as Message["model"];
            }
            if (data.sessionToken) {
              const newToken = data.sessionToken as string;
              localStorage.setItem("askspm_session", newToken);
              setSessionToken(newToken);
            }
          } else if (event.type === "error") {
            throw new Error((event.data.message as string) || "Stream error");
          }
        }
      }

      // Final update
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { ...assistantMessage },
      ]);
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // User cancelled - remove the empty assistant message
        setMessages((prev) => prev.slice(0, -1));
      } else {
        setError(err instanceof Error ? err.message : "Failed to get response");
        // Remove the placeholder message on error
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsStreaming(false);
      setStreamingStatus("");
      abortControllerRef.current = null;
    }
  };

  /**
   * Handle feedback submission
   */
  const handleFeedback = async (
    messageIndex: number,
    feedbackType: "thumbs_up" | "thumbs_down"
  ) => {
    const message = messages[messageIndex];
    if (!message.queryId || message.feedbackGiven) return;

    try {
      const response = await fetch("/api/askspm/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryId: message.queryId,
          feedbackType,
          answerLibraryId: message.libraryAnswerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      // Update local state to show feedback given
      setMessages((prev) =>
        prev.map((m, i) =>
          i === messageIndex ? { ...m, feedbackGiven: feedbackType } : m
        )
      );
    } catch (err) {
      console.error("Feedback error:", err);
    }
  };

  /**
   * Handle new chat - clears conversation and session
   */
  const handleNewChat = () => {
    // Cancel any ongoing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setMessages([]);
    setError(null);
    localStorage.removeItem("askspm_session");
    setSessionToken(null);
  };

  /**
   * Cancel ongoing stream
   */
  const handleCancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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
          <div className="bg-white/5 rounded-xl overflow-hidden border border-[#FF8737]/20">
            {/* Header Bar with New Chat */}
            {messages.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#FF8737]/10 bg-white/5/50">
                <span className="text-xs text-[#64748B]">
                  {messages.filter((m) => m.role === "user").length} question
                  {messages.filter((m) => m.role === "user").length !== 1 ? "s" : ""} in conversation
                </span>
                <button
                  onClick={handleNewChat}
                  className="text-xs text-[#94A3B8] hover:text-[#FF8737] transition-colors flex items-center gap-1"
                >
                  <span>✨</span>
                  <span>New Chat</span>
                </button>
              </div>
            )}

            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#64748B] mb-6">Ask anything about SPM</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {sampleQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleStreamingSubmit(q)}
                        disabled={isStreaming}
                        className="px-4 py-2 text-sm rounded-full bg-[#FF8737]/10 text-[#FF8737] hover:bg-[#FF8737]/20 transition-colors disabled:opacity-50"
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
                      {/* Library hit indicator */}
                      {message.role === "assistant" && message.fromLibrary && (
                        <div className="flex items-center gap-1 mb-2 text-xs text-[#FF8737]">
                          <span>⚡</span>
                          <span>Instant answer from cache</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">
                        {message.content || (
                          <span className="text-[#94A3B8] italic">
                            {streamingStatus || "Loading..."}
                          </span>
                        )}
                      </p>

                      {/* Sources for assistant messages */}
                      {message.role === "assistant" &&
                        message.sources &&
                        message.sources.length > 0 && (
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
                                    className="text-xs bg-white/5 rounded-lg p-3"
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

                      {/* Feedback buttons */}
                      {message.role === "assistant" && message.queryId && message.content && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5">
                          <span className="text-xs text-[#64748B]">Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(index, "thumbs_up")}
                            disabled={!!message.feedbackGiven}
                            className={`p-1.5 rounded-md transition-colors ${
                              message.feedbackGiven === "thumbs_up"
                                ? "bg-green-500/20 text-green-400"
                                : message.feedbackGiven
                                  ? "text-[#475569] cursor-not-allowed"
                                  : "text-[#64748B] hover:text-green-400 hover:bg-green-500/10"
                            }`}
                            title="Helpful"
                          >
                            👍
                          </button>
                          <button
                            onClick={() => handleFeedback(index, "thumbs_down")}
                            disabled={!!message.feedbackGiven}
                            className={`p-1.5 rounded-md transition-colors ${
                              message.feedbackGiven === "thumbs_down"
                                ? "bg-red-500/20 text-red-400"
                                : message.feedbackGiven
                                  ? "text-[#475569] cursor-not-allowed"
                                  : "text-[#64748B] hover:text-red-400 hover:bg-red-500/10"
                            }`}
                            title="Not helpful"
                          >
                            👎
                          </button>
                          {message.feedbackGiven && (
                            <span className="text-xs text-[#64748B] ml-1">Thanks!</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {isStreaming && !messages[messages.length - 1]?.content && (
                <div className="flex justify-start">
                  <div className="bg-[#334155] text-[#94A3B8] rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FF8737] rounded-full animate-pulse" />
                      <div
                        className="w-2 h-2 bg-[#FF8737] rounded-full animate-pulse"
                        style={{ animationDelay: "75ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-[#FF8737] rounded-full animate-pulse"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span className="ml-2 text-sm">{streamingStatus || "Connecting..."}</span>
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
                  handleStreamingSubmit(input);
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about SPM, ICM, governance, quotas..."
                  className="flex-1 bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#FF8737] transition-colors"
                  disabled={isStreaming}
                />
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleCancelStream}
                    className="px-6 py-3 bg-[#475569] text-white font-semibold rounded-lg hover:bg-[#64748B] transition-colors"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="px-6 py-3 bg-[#FF8737] text-white font-semibold rounded-lg hover:bg-[#FF8737]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Ask
                  </button>
                )}
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
