# IntelligentSPM Website Design

> Created: January 25, 2026
> Status: Approved

## Overview

IntelligentSPM is the SPM Clearing House website featuring:
- 4 Hero Healthcheck tools
- Blog → Podcast → Video content pipeline
- SPM reference material (KB, policies, frameworks)
- The Syndicate newsletter
- The Toddfather personal brand integration

## Content Flow

```
Blog Post (written)
    ↓ publish
Newsletter (Syndicate subscribers get it)
    ↓ record
Podcast Episode (audio)
    ↓ if popular (manual + metrics)
Video (Toddfather avatar)
```

### Popularity Tracking (all 4 methods)
1. Manual selection
2. Play count / downloads
3. Engagement metrics (comments, shares, saves)
4. Hybrid approach

## Site Structure

```
app/
├── (home)/page.tsx              # 4 rotating heroes
│
├── healthcheck/                 # The 4 Hero Tools
│   ├── spm/                     # SPM Healthcheck (8 pillar quiz)
│   ├── comp-plan/               # Upload plan → analyze → score → cards
│   ├── governance/              # Upload policy → same flow
│   └── ask-spm/                 # AskSPM LLM/RAG
│
├── learn/                       # Reference Material
│   ├── spm-101/                 # SPM basics
│   ├── framework/               # 8 pillars, 929 KB cards
│   └── glossary/                # Terms
│
├── blog/                        # Blog Posts
│   ├── page.tsx                 # List with popularity tracking
│   └── [slug]/page.tsx          # Individual post
│
├── podcast/                     # Podcast Episodes
│   ├── page.tsx                 # Episode list with plays/engagement
│   └── [slug]/page.tsx          # Episode player + transcript
│
├── videos/                      # Video Library
│   └── [id]/page.tsx            # Video player
│
├── syndicate/                   # Newsletter signup
│   └── page.tsx                 # The Syndicate by The Toddfather
│
├── toddfather/                  # Personal brand
│   └── page.tsx                 # About The Toddfather
│
└── api/
    ├── newsletter/subscribe     # Resend integration
    ├── healthcheck/             # Healthcheck APIs
    └── content/                 # Blog/podcast CRUD + metrics
```

## Design System

### Fonts
System fonts (clean, modern, fast):
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Background Dark | `#0F172A` | Page backgrounds |
| Background Light | `#1E293B` | Cards, sections |
| Teal | `#38BDF8` | "SPM" in logo, primary CTAs |
| Orange | `#FF8737` | "Toddfather", accents, pricing |
| AI Purple (Primary) | `#8241C8` | AI badges, icons |
| AI Purple (Dark) | `#58108E` | AI backgrounds |
| Lime | `#A3E635` | Success, governance |
| Hot Pink | `#EA1B85` | Errors, problems, agitation |
| Text Primary | `#E2E8F0` | Headlines |
| Text Muted | `#94A3B8` | Secondary text |

### Key Rule: Purple = AI
All AI-related features use the purple palette.

## 4 Hero Healthchecks

### 1. SPM Healthcheck (Teal)
- Quiz on current state against 8 pillars
- Returns pillar scores + recommendations

### 2. Comp Plan Healthcheck (Purple - AI)
- Upload plan document
- AI analyzes, scores, reviews
- Returns suggestions in card format

### 3. Governance Healthcheck (Lime)
- Upload governance/policy document
- Same flow as comp plan
- Returns governance gaps + recommendations

### 4. AskSPM (Orange)
- Try the Toddfather LLM/RAG
- CTA to contact for custom tool
- Fix typo: "AskSM" → "AskSPM"

## Blog/Podcast Topics (18 topics)

| # | Topic | AI/Intelligence Angle |
|---|-------|----------------------|
| 1 | Why Accelerators Break Forecasting | AI detects deal stuffing patterns |
| 2 | The Quiet Way Draws Destroy Trust | Intelligent monitoring spots abuse |
| 3 | Clawbacks Done Right | AI-powered recovery tracking |
| 4 | SPIFs Are Dopamine, Not Strategy | Intelligence shows SPIF ROI |
| 5 | Quota Relief: The Math Problem | AI scenario modeling |
| 6 | Territory Changes Mid-Quarter | Intelligent rebalancing |
| 7 | Capacity Planning Reality | AI-driven capacity models |
| 8 | Your Comp Oversight Is Duct Tape | Intelligent governance automation |
| 9 | Auditability Is Not Bureaucracy | AI audit trails |
| 10 | Disputes Are Design Failures | Intelligent dispute prediction |
| 11 | Where AI Helps (and Hurts) SPM | Core thesis |
| 12 | Human Override Is Not Optional | Governance layer AI needs |
| 13 | AI Finds Patterns, Not Causes | Intelligence vs understanding |
| 14 | Vendor Reality: Who Breaks Where | Intelligent vendor selection |
| 15 | What Happens During SPM Rollouts | AI-assisted implementation |
| 16 | Comp Plans Are Constraints | Intelligent constraint modeling |
| 17 | Pay Drives Behavior | Behavioral intelligence |
| 18 | The Crediting Problem | AI-powered crediting resolution |

## The Syndicate Newsletter

- Weekly SPM reality digest
- Office hours with The Toddfather
- Early access to tools and benchmarks
- Network of SPM professionals
- Resend integration for email capture

## Reference Material (from SGM)

### 8 Pillars (929 KB Cards)
1. Sales Planning
2. ICM (Incentive Compensation Management)
3. Sales Intelligence & Analytics
4. Governance & Compliance
5. Technology & Platforms
6. Strategy & Design
7. Implementation & Change
8. Legal & Regulatory

### 17 SCP Policies
- SCP-001 through SCP-017
- Clawback, Quota, Windfall, SPIF, 409A, etc.

## Homepage Sections

1. **Nav** - Logo + Blog, Learn, Tools, Vendors, Services, The Toddfather + Subscribe
2. **Hero** - 4 rotating heroes with healthcheck CTAs
3. **Pillars** - 5 colored pills (Planning, Technology, Operations, Governance, Intelligence)
4. **Featured** - 3 blog cards with category colors
5. **Toddfather** - Avatar + bio + podcast/story links
6. **Problem** - Hot pink agitation section with stats
7. **Services** - 3 pricing cards
8. **Subscribe** - The Syndicate email capture

## Implementation Priority

1. Fix fonts (system fonts, not Space_Grotesk)
2. Build homepage structure from design
3. Add healthcheck routes (stub pages)
4. Add blog/podcast/video routes
5. Add syndicate newsletter
6. Port KB/policies from SGM
7. Implement healthcheck tools
8. Add content tracking/metrics
