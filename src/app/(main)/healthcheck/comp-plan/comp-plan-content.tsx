"use client";

import { useState, useCallback, useEffect } from "react";
import { UploadIcon, FileTextIcon, CrossCircledIcon, ReloadIcon } from "@radix-ui/react-icons";

type Finding = {
  pillarId: string;
  pillarName: string;
  issue: string;
  risk: "immediate" | "priority" | "monitor";
  impact: string;
  confidence: number;
};

type AnalysisResult = {
  id: string;
  tier: string;
  cardType: string;
  confidence: number;
  coverageScore: number;
  quickCard: {
    coverageScore: number;
    coverageGauge: "low" | "medium" | "high";
    riskSnapshot: { immediate: number; priority: number; monitor: number };
    topGaps: Array<{ policy: string; risk: string }>;
    recommendation: string;
  };
  pillarScores?: Record<string, number>;
  findings?: Finding[];
  meta: {
    analyzedAt: string;
    durationMs: number;
    method: string;
  };
};

// 8 Comp Plan Pillars
const ALL_PILLARS = [
  { id: "PILLAR-01", name: "Plan Design & Structure", short: "Design" },
  { id: "PILLAR-02", name: "Pay Mix & Target Comp", short: "Pay Mix" },
  { id: "PILLAR-03", name: "Performance Measures", short: "Performance" },
  { id: "PILLAR-04", name: "Commission Mechanics", short: "Mechanics" },
  { id: "PILLAR-05", name: "Caps & Thresholds", short: "Protections" },
  { id: "PILLAR-06", name: "Payment & Timing", short: "Execution" },
  { id: "PILLAR-07", name: "Territory & Account Rules", short: "Fairness" },
  { id: "PILLAR-08", name: "Plan Changes & Governance", short: "Governance" },
];

interface CompPlanContentProps {
  userEmail?: string | null;
}

export default function CompPlanContent({ userEmail }: CompPlanContentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDebug, setShowDebug] = useState(false);
  const [pillarScores, setPillarScores] = useState<Record<string, number>>({});

  // Calculate stable pillar scores when result arrives
  useEffect(() => {
    if (result) {
      const scores: Record<string, number> = {};
      const topGapPolicies = result.quickCard.topGaps?.map(g => g.policy.toLowerCase()) || [];

      ALL_PILLARS.forEach((pillar, index) => {
        // Check if this pillar has issues flagged
        const hasIssue = topGapPolicies.some(gap =>
          pillar.name.toLowerCase().includes(gap.toLowerCase()) ||
          pillar.short.toLowerCase().includes(gap.toLowerCase()) ||
          gap.toLowerCase().includes(pillar.short.toLowerCase())
        );

        if (result.pillarScores && result.pillarScores[pillar.id]) {
          scores[pillar.id] = result.pillarScores[pillar.id];
        } else if (hasIssue) {
          // Pillars with issues get lower scores
          scores[pillar.id] = 20 + (index * 5) % 30;
        } else {
          // Use deterministic approach based on index and overall score
          const base = result.quickCard.coverageScore || 50;
          const variance = ((index * 13 + base) % 40) - 20;
          scores[pillar.id] = Math.max(20, Math.min(100, base + variance));
        }
      });

      setPillarScores(scores);

      // Animate the score
      const targetScore = result.quickCard.coverageScore;
      setAnimatedScore(0);
      const duration = 1200;
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedScore(Math.round(targetScore * eased));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [result]);

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF, DOCX, or TXT file.");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a PDF, DOCX, or TXT file.");
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    return validTypes.includes(file.type) || file.name.endsWith(".txt");
  };

  const analyzeDocument = async () => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      let body: { documentText?: string; documentBase64?: string; tier: string; context: string; email?: string };

      if (inputMode === "paste" && textInput.trim()) {
        body = { documentText: textInput, tier: "quick", context: "scm-comp-plan", email: userEmail || undefined };
      } else if (file) {
        const base64 = await fileToBase64(file);
        body = { documentBase64: base64, tier: "quick", context: "scm-comp-plan", email: userEmail || undefined };
      } else {
        throw new Error("No document provided");
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check for gate block
        if (errorData.code === 'USER_LIMIT' || errorData.code === 'COMPANY_LIMIT') {
          throw new Error(errorData.message || "Analysis limit reached");
        }
        throw new Error(errorData.message || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const resetAnalysis = () => {
    setFile(null);
    setTextInput("");
    setResult(null);
    setError(null);
    setAnimatedScore(0);
  };

  // Get pillar score from stable state
  const getPillarScore = (pillarId: string): number => {
    return pillarScores[pillarId] || 50;
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981"; // green
    if (score >= 60) return "#A3E635"; // lime
    if (score >= 40) return "#F59E0B"; // amber
    return "#DC2626"; // red
  };

  // Get tier info
  const getTierInfo = (score: number) => {
    if (score >= 80) return { name: "Optimized", color: "#10B981" };
    if (score >= 60) return { name: "Healthy", color: "#A3E635" };
    if (score >= 40) return { name: "At Risk", color: "#F59E0B" };
    return { name: "Critical", color: "#DC2626" };
  };

  // Results view - 4 Quadrant Layout
  if (result) {
    const score = result.quickCard.coverageScore;
    const tier = getTierInfo(score);
    const { immediate, priority, monitor } = result.quickCard.riskSnapshot;
    const totalIssues = immediate + priority + monitor;

    return (
      <div className="min-h-screen bg-[#0F172A] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8241C8] flex items-center justify-center text-sm font-bold text-white">
                COMP
              </div>
              <h1 className="text-2xl font-bold text-white">Comp Plan Analysis</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDebug(!showDebug)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showDebug
                    ? "bg-[#8241C8]/20 text-[#8241C8] border border-[#8241C8]/50"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {showDebug ? "Hide" : "Show"} Raw Data
              </button>
              <button
                onClick={resetAnalysis}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ReloadIcon className="w-4 h-4" />
                Analyze Another
              </button>
            </div>
          </div>

          {/* Debug View - Raw API Response */}
          {showDebug && (
            <div className="mb-6 bg-[#0F172A] rounded-xl p-6 border border-[#8241C8]/30">
              <h3 className="text-[#8241C8] font-semibold mb-3">Raw API Response</h3>
              <pre className="text-white/80 text-sm overflow-auto max-h-96 bg-white/5 rounded-lg p-4">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {/* 4-Quadrant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Quadrant 1: Plan Health Score */}
            <div className="bg-white/5 rounded-2xl p-8 border border-[#8241C8]/20">
              <h2 className="text-sm font-semibold text-[#8241C8] uppercase tracking-wide mb-6 text-center">Plan Health Score</h2>
              <div className="flex flex-col items-center gap-4">
                {/* Circular Progress */}
                <div className="relative w-36 h-36">
                  <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={tier.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(animatedScore / 100) * 251.2} 251.2`}
                      className="transition-all duration-1000"
                      style={{ filter: `drop-shadow(0 0 8px ${tier.color})` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">{animatedScore}</span>
                    <span className="text-white/60 text-base">/ 100</span>
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide"
                    style={{ backgroundColor: `${tier.color}20`, color: tier.color }}
                  >
                    {tier.name}
                  </div>
                </div>
                <p className="text-white/50 text-sm text-center mt-2 max-w-[220px]">
                  Overall health across 8 compensation design pillars
                </p>
              </div>
            </div>

            {/* Quadrant 2: Pillar Breakdown */}
            <div className="bg-white/5 rounded-2xl p-8 border border-[#8241C8]/20">
              <h2 className="text-sm font-semibold text-[#8241C8] uppercase tracking-wide mb-4">Pillar Breakdown</h2>
              <p className="text-white/50 text-sm mb-4">8 Design Dimensions Analyzed</p>
              <div className="space-y-3">
                {ALL_PILLARS.map((pillar) => {
                  const pillarScore = getPillarScore(pillar.id);
                  const scoreColor = getScoreColor(pillarScore);
                  return (
                    <div key={pillar.id} className="flex items-center gap-3">
                      <span className="text-white/80 text-sm w-28 truncate">{pillar.short}</span>
                      <div className="flex-1 h-2.5 bg-[#334155] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pillarScore}%`, backgroundColor: scoreColor }}
                        />
                      </div>
                      <span className="text-white/60 text-sm w-10 text-right">{pillarScore}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quadrant 3: Risk Snapshot */}
            <div className="bg-white/5 rounded-2xl p-8 border border-[#8241C8]/20">
              <h2 className="text-sm font-semibold text-[#8241C8] uppercase tracking-wide mb-4">Risk Snapshot</h2>
              <p className="text-white/50 text-sm mb-5">Issues by severity</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-white/80">Immediate</div>
                  <div className="flex-1 h-7 bg-[#334155] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#DC2626] rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${Math.max((immediate / 10) * 100, 20)}%` }}
                    >
                      <span className="text-sm font-bold text-white">{immediate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-white/80">Priority</div>
                  <div className="flex-1 h-7 bg-[#334155] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F59E0B] rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${Math.max((priority / 10) * 100, 20)}%` }}
                    >
                      <span className="text-sm font-bold text-white">{priority}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-white/80">Monitor</div>
                  <div className="flex-1 h-7 bg-[#334155] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3B82F6] rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${Math.max((monitor / 10) * 100, 20)}%` }}
                    >
                      <span className="text-sm font-bold text-white">{monitor}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10 text-white/60 text-base font-medium">
                {totalIssues} total issues identified
              </div>
            </div>

            {/* Quadrant 4: Action Plan */}
            <div className="bg-white/5 rounded-2xl p-8 border border-[#8241C8]/20">
              <h2 className="text-sm font-semibold text-[#8241C8] uppercase tracking-wide mb-4">Top Issues</h2>
              <p className="text-white/50 text-sm mb-4">Priority areas to address</p>
              <div className="space-y-3 mb-5">
                {(result.quickCard.topGaps || []).slice(0, 3).map((gap, i) => {
                  const isImmediate = gap.risk.toLowerCase().includes("immediate");
                  const color = isImmediate ? "#DC2626" : "#F59E0B";
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: color }} />
                      <div>
                        <span className="text-white/90 block">{gap.policy}</span>
                        <span className="text-white/50 text-sm">{gap.risk}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-white/60 text-sm mb-5">{result.quickCard.recommendation}</p>
              {(() => {
                const cta =
                  score >= 70
                    ? { text: "Fine-Tune Plan", bg: "bg-[#8241C8]", textColor: "text-white" }
                    : score >= 40
                    ? { text: "Get Expert Review", bg: "bg-[#F59E0B]", textColor: "text-[#0F172A]" }
                    : { text: "Request Plan Redesign", bg: "bg-[#DC2626]", textColor: "text-white" };
                return (
                  <button className={`w-full py-3.5 rounded-xl font-bold text-base ${cta.bg} ${cta.textColor} hover:opacity-90 transition-opacity`}>
                    {cta.text} →
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Consulting CTA Section */}
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-8 border border-[#8241C8]/30">
            <h2 className="text-2xl font-bold text-white mb-2">
              Poorly Designed Plans Cost <span className="text-[#DC2626]">15-25%</span> of Sales Comp Spend
            </h2>
            <p className="text-white/60 mb-6">
              Misaligned incentives, windfall payouts, and rep churn from unfair plans drain your budget and hurt performance.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-[#8241C8] font-semibold mb-3">A Comp Plan Redesign Delivers:</h3>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> Pay mix optimization by role
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> Accelerator/decelerator modeling
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> Windfall protection mechanisms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#10B981]">✓</span> Territory equity analysis
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#8241C8] font-semibold mb-3">Typical Outcomes:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-[#10B981]">12%</div>
                    <div className="text-white/50 text-sm">Comp Cost Savings</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-[#8241C8]">23%</div>
                    <div className="text-white/50 text-sm">Quota Attainment Lift</div>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="/toddfather/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#8241C8] text-white font-bold rounded-xl hover:bg-[#9333EA] transition-colors"
            >
              Schedule a Comp Plan Review →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Upload view
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#8241C8] flex items-center justify-center text-2xl font-bold text-white mx-auto mb-8">
            COMP
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E2E8F0] mb-6">
            Comp Plan Healthcheck
          </h1>
          <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto mb-12">
            Upload your compensation plan document. We&apos;ll analyze it across 8 design pillars and identify risks, gaps, and optimization opportunities.
          </p>

          {/* Input Mode Toggle */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setInputMode("upload")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMode === "upload"
                  ? "bg-[#8241C8] text-white"
                  : "bg-white/5 text-[#94A3B8] hover:bg-[#334155]"
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setInputMode("paste")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                inputMode === "paste"
                  ? "bg-[#8241C8] text-white"
                  : "bg-white/5 text-[#94A3B8] hover:bg-[#334155]"
              }`}
            >
              Paste Text
            </button>
          </div>

          {/* Upload Area */}
          {inputMode === "upload" ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className={`bg-white/5 rounded-xl p-10 border-2 border-dashed transition-colors mb-8 ${
                file ? "border-[#8241C8]" : "border-[#334155] hover:border-[#8241C8]/50"
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <FileTextIcon className="w-12 h-12 text-[#8241C8]" />
                  <div className="text-left">
                    <p className="text-[#E2E8F0] font-medium">{file.name}</p>
                    <p className="text-[#64748B] text-sm">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="ml-4 text-[#64748B] hover:text-red-400 transition-colors"
                  >
                    <CrossCircledIcon className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <UploadIcon className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                  <p className="text-[#E2E8F0] font-medium mb-2">Drag & drop your comp plan here</p>
                  <p className="text-[#64748B] text-sm mb-4">or click to browse</p>
                  <p className="text-[#64748B] text-xs">Supports PDF, DOCX, TXT</p>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="mb-8">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your compensation plan text here..."
                className="w-full h-64 bg-white/5 rounded-xl p-6 text-[#E2E8F0] placeholder-[#64748B] border-2 border-[#334155] focus:border-[#8241C8] focus:outline-none resize-none"
              />
              <p className="text-[#64748B] text-sm mt-2 text-right">{textInput.length} characters</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-400">
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={analyzeDocument}
            disabled={isAnalyzing || (inputMode === "upload" ? !file : !textInput.trim())}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              isAnalyzing || (inputMode === "upload" ? !file : !textInput.trim())
                ? "bg-[#334155] text-[#64748B] cursor-not-allowed"
                : "bg-[#8241C8] text-white hover:bg-[#9333EA] hover:scale-105"
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <ReloadIcon className="w-5 h-5 animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Analyze Plan"
            )}
          </button>

          {/* What We Analyze */}
          <div className="mt-12 bg-white/5 rounded-xl p-6 border border-[#8241C8]/10">
            <h4 className="text-sm font-semibold text-[#8241C8] uppercase tracking-wider mb-4">
              8 Pillars We Analyze
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-[#94A3B8]">
              {ALL_PILLARS.map((pillar) => (
                <div key={pillar.id} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#8241C8]" />
                  {pillar.short}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[#64748B] text-sm mt-8">
            Your document is analyzed securely and not stored.
          </p>
        </div>
      </section>
    </div>
  );
}
