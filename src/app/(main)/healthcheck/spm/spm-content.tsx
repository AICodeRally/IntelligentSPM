"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import {
  pillars,
  maturityLevels,
  calculatePillarScore,
  calculatePercentage,
  getTierBadge,
} from "./data/questions";

type Phase = "quiz" | "results";

interface SPMContentProps {
  userEmail?: string | null;
}

interface HealthcheckState {
  email: string;
  answers: Record<string, number>;
  currentPillar: number;
  currentQuestion: number;
}

const STORAGE_KEY = "spm-healthcheck-progress";

function loadState(): HealthcheckState | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

function saveState(state: HealthcheckState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// Spider Chart Component
function SpiderChart({ answers }: { answers: Record<string, number> }) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 100;
  const levels = 4;

  // Calculate points for each pillar
  const pillarScores = pillars.map((p) => {
    const score = calculatePillarScore(answers, p.id);
    const maxScore = 12;
    return score / maxScore;
  });

  // Generate polygon points
  const angleStep = (2 * Math.PI) / pillars.length;
  const points = pillarScores.map((score, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const radius = score * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Generate grid lines
  const gridLines = [];
  for (let level = 1; level <= levels; level++) {
    const radius = (level / levels) * maxRadius;
    const gridPoints = pillars.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
    });
    gridLines.push(gridPoints.join(" "));
  }

  // Generate axis lines and labels
  const axes = pillars.map((pillar, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const labelRadius = maxRadius + 25;
    return {
      x1: center,
      y1: center,
      x2: center + maxRadius * Math.cos(angle),
      y2: center + maxRadius * Math.sin(angle),
      labelX: center + labelRadius * Math.cos(angle),
      labelY: center + labelRadius * Math.sin(angle),
      pillar,
    };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-[280px] mx-auto">
      {/* Grid polygons */}
      {gridLines.map((points, i) => (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#334155"
          strokeWidth="1"
          opacity={0.5}
        />
      ))}

      {/* Axis lines */}
      {axes.map((axis, i) => (
        <line
          key={i}
          x1={axis.x1}
          y1={axis.y1}
          x2={axis.x2}
          y2={axis.y2}
          stroke="#334155"
          strokeWidth="1"
          opacity={0.5}
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="#38BDF820"
        stroke="#38BDF8"
        strokeWidth="2"
      />

      {/* Data points */}
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="4"
          fill={pillars[i].color}
          stroke="#0F172A"
          strokeWidth="2"
        />
      ))}

      {/* Labels */}
      {axes.map((axis, i) => (
        <text
          key={i}
          x={axis.labelX}
          y={axis.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={axis.pillar.color}
          fontSize="11"
          fontWeight="600"
        >
          {axis.pillar.id}
        </text>
      ))}
    </svg>
  );
}

// Quiz Component - 1 page per lever with table layout
function Quiz({
  state,
  onAnswer,
  onComplete,
}: {
  state: HealthcheckState;
  onAnswer: (pillarIndex: number, questionIndex: number, value: number) => void;
  onComplete: () => void;
}) {
  const pillar = pillars[state.currentPillar];
  const Icon = pillar.icon;
  const isLastPillar = state.currentPillar === pillars.length - 1;
  const progress = ((state.currentPillar + 1) / pillars.length) * 100;

  // Check if all questions for this pillar are answered
  const allAnswered = pillar.questions.every(
    (_, i) => state.answers[`${pillar.id}-${i}`] !== undefined
  );

  const handleSelect = (questionIndex: number, value: number) => {
    onAnswer(state.currentPillar, questionIndex, value);
  };

  const handleBack = () => {
    if (state.currentPillar > 0) {
      onAnswer(state.currentPillar - 1, 0, -1);
    }
  };

  const handleNext = () => {
    if (!allAnswered) return;
    if (isLastPillar) {
      onComplete();
    } else {
      onAnswer(state.currentPillar + 1, 0, -1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: pillar.color }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#64748B]">
                  Lever {state.currentPillar + 1} of {pillars.length}
                </p>
                <p className="text-xl font-bold" style={{ color: pillar.color }}>
                  {pillar.name}
                </p>
              </div>
            </div>
            <span className="text-[#64748B] text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: pillar.color }}
            />
          </div>
          {/* Lever dots */}
          <div className="flex justify-between mt-3">
            {pillars.map((p, i) => {
              const PIcon = p.icon;
              const isComplete = i < state.currentPillar;
              const isCurrent = i === state.currentPillar;
              return (
                <div
                  key={p.id}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: isComplete
                      ? p.color
                      : isCurrent
                      ? `${p.color}40`
                      : "#1E293B",
                  }}
                  title={p.name}
                >
                  {isComplete ? (
                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                  ) : (
                    <PIcon className="w-4 h-4" style={{ color: isCurrent ? p.color : "#64748B" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-white/5 rounded-xl border border-[#38BDF8]/30 overflow-hidden mb-6">
          {/* Table Header */}
          <div className="flex items-center p-4 bg-[#0F172A] border-b border-white/10">
            <div className="flex-1 text-sm font-semibold text-[#94A3B8]">Question</div>
            <div className="flex gap-1">
              {maturityLevels.map((level) => (
                <div
                  key={level.value}
                  className="w-10 text-center text-xs font-bold text-[#94A3B8]"
                  title={level.description}
                >
                  {level.value}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 px-4 py-2 bg-[#0F172A]/80 border-b border-white/10 text-xs text-[#CBD5E1]">
            {maturityLevels.map((level) => (
              <span key={level.value}>
                <span className="font-bold text-white">{level.value}</span> = {level.label}
              </span>
            ))}
          </div>

          {/* Question Rows */}
          {pillar.questions.map((question, qIndex) => {
            const answerKey = `${pillar.id}-${qIndex}`;
            const currentAnswer = state.answers[answerKey];

            return (
              <div
                key={qIndex}
                className={`flex items-center p-4 transition-colors ${
                  qIndex < pillar.questions.length - 1 ? "border-b border-white/10" : ""
                } ${currentAnswer !== undefined ? "bg-[#38BDF8]/10" : ""}`}
              >
                <p className="flex-1 text-base text-white pr-4">{question}</p>
                <div className="flex gap-1">
                  {maturityLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => handleSelect(qIndex, level.value)}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all hover:scale-110 ${
                        currentAnswer === level.value
                          ? "border-transparent"
                          : "border-[#334155] hover:border-[#64748B]"
                      }`}
                      style={{
                        backgroundColor:
                          currentAnswer === level.value ? pillar.color : "transparent",
                      }}
                      title={`${level.label}: ${level.description}`}
                    >
                      {currentAnswer === level.value && (
                        <CheckIcon className="w-5 h-5 text-white" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={state.currentPillar === 0}
            className="px-8 py-3 rounded-xl font-bold border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              borderColor: state.currentPillar > 0 ? pillar.color : "#1E293B",
              color: state.currentPillar > 0 ? pillar.color : "#64748B",
              backgroundColor: "transparent",
            }}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: allAnswered ? pillar.color : "#1E293B",
              color: allAnswered ? "white" : "#64748B",
            }}
          >
            {isLastPillar ? "See Results" : "Next Lever →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Results Component
function Results({
  answers,
  onRetake,
}: {
  answers: Record<string, number>;
  onRetake: () => void;
}) {
  const percentage = calculatePercentage(answers);
  const tier = getTierBadge(percentage);

  // Find top and bottom pillars
  const pillarScores = pillars.map((p) => ({
    ...p,
    score: calculatePillarScore(answers, p.id),
    percentage: Math.round((calculatePillarScore(answers, p.id) / 12) * 100),
  }));

  const sortedPillars = [...pillarScores].sort((a, b) => b.score - a.score);
  const topPillar = sortedPillars[0];
  const bottomPillar = sortedPillars[sortedPillars.length - 1];

  // Categorize pillars by risk level
  const criticalPillars = pillarScores.filter((p) => p.percentage < 40);
  const priorityPillars = pillarScores.filter((p) => p.percentage >= 40 && p.percentage < 60);
  const monitorPillars = pillarScores.filter((p) => p.percentage >= 60 && p.percentage < 80);

  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0F172A] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-xl bg-[#38BDF8] flex items-center justify-center text-xl font-bold text-[#0F172A] mx-auto mb-4">
            SPM
          </div>
          <h1 className="text-3xl font-bold text-[#E2E8F0] mb-2">
            Your SPM Healthcheck Results
          </h1>
          <p className="text-[#94A3B8]">
            Completed {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* 4-Quadrant Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Top Left: Overall Score + Badge */}
          <div className="bg-white/5/80 backdrop-blur-sm rounded-xl p-6 border border-[#38BDF8]/20 flex flex-col items-center justify-center">
            <h3 className="text-sm font-semibold text-[#38BDF8] uppercase tracking-wider mb-4">
              Overall Score
            </h3>
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={tier.color}
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: tier.color }}>
                  {percentage}
                </span>
                <span className="text-xs text-[#94A3B8]">out of 100</span>
              </div>
            </div>
            <div
              className="px-4 py-2 rounded-full font-bold text-white mb-3"
              style={{ backgroundColor: tier.color }}
            >
              {tier.label}
            </div>
            <p className="text-sm text-[#94A3B8] text-center">{tier.description}</p>
          </div>

          {/* Top Right: Spider Chart */}
          <div className="bg-white/5/80 backdrop-blur-sm rounded-xl p-6 border border-[#38BDF8]/20">
            <h3 className="text-sm font-semibold text-[#38BDF8] uppercase tracking-wider mb-4">
              Lever Overview
            </h3>
            <SpiderChart answers={answers} />
          </div>

          {/* Bottom Left: Risk Snapshot */}
          <div className="bg-white/5/80 backdrop-blur-sm rounded-xl p-6 border border-[#38BDF8]/20">
            <h3 className="text-sm font-semibold text-[#38BDF8] uppercase tracking-wider mb-4">
              Risk Snapshot
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#dc2626]/10 rounded-lg border border-[#dc2626]/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#dc2626]" />
                  <span className="text-[#E2E8F0] font-medium">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#dc2626]">{criticalPillars.length}</span>
                  <span className="text-xs text-[#94A3B8]">levers &lt;40%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="text-[#E2E8F0] font-medium">Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#F59E0B]">{priorityPillars.length}</span>
                  <span className="text-xs text-[#94A3B8]">levers 40-60%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#3B82F6]/10 rounded-lg border border-[#3B82F6]/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                  <span className="text-[#E2E8F0] font-medium">Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#3B82F6]">{monitorPillars.length}</span>
                  <span className="text-xs text-[#94A3B8]">levers 60-80%</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/10 text-center">
                <p className="text-sm text-[#94A3B8]">
                  <span className="font-semibold text-[#10B981]">Strongest:</span>{" "}
                  <span style={{ color: topPillar.color }}>{topPillar.name}</span>
                </p>
                <p className="text-sm text-[#94A3B8] mt-1">
                  <span className="font-semibold text-[#dc2626]">Needs Work:</span>{" "}
                  <span style={{ color: bottomPillar.color }}>{bottomPillar.name}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Right: Action Plan */}
          <div className="bg-white/5/80 backdrop-blur-sm rounded-xl p-6 border border-[#38BDF8]/20">
            <h3 className="text-sm font-semibold text-[#38BDF8] uppercase tracking-wider mb-4">
              Action Plan
            </h3>
            <div className="space-y-3">
              {[...pillarScores]
                .sort((a, b) => a.score - b.score)
                .slice(0, 3)
                .map((pillar, i) => (
                  <div
                    key={pillar.id}
                    className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-lg"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{
                        backgroundColor:
                          i === 0 ? "#dc2626" : i === 1 ? "#F59E0B" : "#3B82F6",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#E2E8F0] truncate">
                        {pillar.name}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {pillar.percentage}% - Needs attention
                      </p>
                    </div>
                    <Link
                      href={pillar.learnLink}
                      className="text-xs font-medium px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                      style={{ color: pillar.color }}
                    >
                      Learn →
                    </Link>
                  </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-[#94A3B8] mb-3">
                {percentage < 50
                  ? "Your SPM program has significant gaps. A comprehensive review is recommended."
                  : percentage < 75
                  ? "Solid foundation with room to improve. Focus on the levers above."
                  : "Strong SPM program! Fine-tune the areas above for excellence."}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Lever Breakdown */}
        <div className="bg-white/5/80 backdrop-blur-sm rounded-xl p-6 border border-[#38BDF8]/20 mb-10">
          <h3 className="text-sm font-semibold text-[#38BDF8] uppercase tracking-wider mb-4">
            Detailed Breakdown
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {pillarScores.map((pillar) => {
              const Icon = pillar.icon;
              const isExpanded = expandedPillar === pillar.id;
              return (
                <div
                  key={pillar.id}
                  className="bg-[#0F172A] rounded-xl p-4 cursor-pointer transition-all hover:bg-[#0F172A]/80"
                  onClick={() =>
                    setExpandedPillar(isExpanded ? null : pillar.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: pillar.color }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: pillar.color }}
                        >
                          {pillar.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pillar.percentage}%`,
                                backgroundColor:
                                  pillar.percentage < 40
                                    ? "#dc2626"
                                    : pillar.percentage < 70
                                    ? "#ca8a04"
                                    : "#16a34a",
                              }}
                            />
                          </div>
                          <span className="text-xs text-[#64748B]">
                            {pillar.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-[#64748B] transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      {pillar.questions.map((q, i) => {
                        const answer = answers[`${pillar.id}-${i}`] ?? 0;
                        const level = maturityLevels[answer];
                        return (
                          <div key={i} className="text-sm">
                            <p className="text-[#94A3B8] mb-1">{q}</p>
                            <p
                              className="font-medium"
                              style={{
                                color:
                                  answer < 2
                                    ? "#dc2626"
                                    : answer < 3
                                    ? "#ca8a04"
                                    : "#16a34a",
                              }}
                            >
                              → {level.label}
                            </p>
                          </div>
                        );
                      })}
                      <Link
                        href={pillar.learnLink}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block mt-2 text-sm font-medium hover:underline"
                        style={{ color: pillar.color }}
                      >
                        Learn more →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Consulting CTA Section */}
        <div className="bg-gradient-to-r from-[#38BDF8]/10 to-[#0891B2]/10 rounded-xl p-8 border border-[#38BDF8]/30 mb-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#E2E8F0] mb-2">
              Turn Insights Into Action
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              Your assessment reveals opportunities for improvement. Get expert guidance to build a world-class SPM program.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0F172A]/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-[#38BDF8] mb-1">40%</div>
              <p className="text-sm text-[#94A3B8]">Average efficiency gain</p>
            </div>
            <div className="bg-[#0F172A]/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-[#38BDF8] mb-1">2.5x</div>
              <p className="text-sm text-[#94A3B8]">Typical ROI in Year 1</p>
            </div>
            <div className="bg-[#0F172A]/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-[#38BDF8] mb-1">60%</div>
              <p className="text-sm text-[#94A3B8]">Dispute reduction</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/toddfather/contact?topic=healthcheck-review">
              <button className="px-8 py-4 bg-[#38BDF8] text-[#0F172A] font-bold rounded-xl hover:bg-[#38BDF8]/90 transition-all hover:scale-105">
                Schedule SPM Review
              </button>
            </Link>
            <Link href="/syndicate">
              <button className="px-8 py-4 border-2 border-[#38BDF8]/50 text-[#38BDF8] font-bold rounded-xl hover:border-[#38BDF8] transition-all">
                Join The Syndicate
              </button>
            </Link>
          </div>
        </div>

        {/* Retake */}
        <div className="text-center">
          <button
            onClick={onRetake}
            className="text-[#94A3B8] hover:text-white text-sm transition-colors"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

// Initialize state from localStorage (lazy initialization)
function getInitialState(userEmail: string | null | undefined): { state: HealthcheckState; phase: Phase } {
  const saved = loadState();
  if (saved && saved.email === userEmail) {
    const allAnswered = pillars.every((p) =>
      p.questions.every((_, i) => saved.answers[`${p.id}-${i}`] !== undefined)
    );
    return {
      state: saved,
      phase: allAnswered ? "results" : "quiz",
    };
  }
  return {
    state: {
      email: userEmail || "",
      answers: {},
      currentPillar: 0,
      currentQuestion: 0,
    },
    phase: "quiz",
  };
}

// Main Component
export default function SPMContent({ userEmail }: SPMContentProps) {
  // Use lazy initialization to avoid setState in useEffect
  const [{ state: initialState, phase: initialPhase }] = useState(() =>
    getInitialState(userEmail)
  );
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const [state, setState] = useState<HealthcheckState>(initialState);

  // Handle userEmail prop changes after initial render
  useEffect(() => {
    // Only run if userEmail changes and differs from current state
    if (userEmail && userEmail !== state.email) {
      const saved = loadState();
      if (saved && saved.email === userEmail) {
        setState(saved);
        const allAnswered = pillars.every((p) =>
          p.questions.every((_, i) => saved.answers[`${p.id}-${i}`] !== undefined)
        );
        if (allAnswered) {
          setPhase("results");
        }
      } else {
        setState((prev) => ({ ...prev, email: userEmail }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const handleAnswer = (pillarIndex: number, questionIndex: number, value: number) => {
    const pillar = pillars[pillarIndex];
    const key = `${pillar.id}-${questionIndex}`;

    const newState = {
      ...state,
      currentPillar: pillarIndex,
      currentQuestion: questionIndex,
      answers: value >= 0 ? { ...state.answers, [key]: value } : state.answers,
    };
    setState(newState);
    saveState(newState);
  };

  const handleComplete = () => {
    setPhase("results");
  };

  const handleRetake = () => {
    clearState();
    setState({
      email: state.email, // Keep email
      answers: {},
      currentPillar: 0,
      currentQuestion: 0,
    });
    setPhase("quiz");
  };

  if (phase === "quiz") {
    return (
      <Quiz
        state={state}
        onAnswer={handleAnswer}
        onComplete={handleComplete}
      />
    );
  }

  return <Results answers={state.answers} onRetake={handleRetake} />;
}
