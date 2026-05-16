# AI UGC Creator's Blueprint — Mastery Curriculum

A 12-week, outcome-driven learning plan for mastering the **AI UGC Creator's Blueprint: My Core Workflow** product, the advanced training extension, the Claude Code Integration Guide, the live update stream, and the community channel.

The curriculum is built around six skill pillars and one production pillar:

1. AI Influencer Pipeline (end-to-end)
2. Photoreal AI Persona Construction
3. Viral UGC with Real Products
4. Brand-Consistent Visual Generation
5. Throughput & Optimization
6. Claude Code Automation for Content Systems
7. Advanced Prompt Engineering

Each week has: goals, study material, hands-on lab, deliverable, success criteria, and a community/feedback ritual.

---

## How to Use This Plan

- **Time budget:** ~10–12 hours/week. ~6 hrs study, ~5 hrs lab, ~1 hr community/review.
- **Cadence:** One module per week. Don't skip the labs — the deliverables compound.
- **Tracking:** Maintain a `/portfolio` folder with one subfolder per week. Each lab deliverable lives there.
- **Live updates:** Reserve 30 min every Monday to skim the live-update feed and patch your workflow.
- **Community ritual:** Post your week's deliverable in the community channel by Friday; review two peers' posts by Sunday.

### Tooling baseline (set up in Week 0)

- AI image: Midjourney + an open SDXL/Flux pipeline (ComfyUI or Fooocus)
- AI video: a lip-sync/talking-head tool (e.g., HeyGen-class), a motion tool (e.g., Runway/Kling-class)
- Voice: a TTS/voice-clone tool with consented voices only
- Editing: CapCut or Premiere
- Automation: Claude Code, a scripting language of your choice (Python or TypeScript), and a job runner (Make/n8n optional)
- Storage: a single source of truth for assets (Drive/S3) with a strict folder convention

> **Ethics gate (read before Week 1):** Do not clone real people without written consent. Disclose AI-generated content per platform policy and applicable law. Never fabricate testimonials about real products you have not used or are not authorized to depict. The pipeline below assumes you operate within these constraints — it is *not* a workaround for them.

---

## Week 0 — Orientation & Environment

**Goal:** Be able to render one prompt-to-image and one prompt-to-clip end-to-end before Week 1.

- Install/verify every tool in the baseline.
- Create the portfolio folder structure: `00-orientation/`, `01-pipeline/`, ... `12-capstone/`.
- Read the Blueprint's Table of Contents end-to-end. Mark sections you'd skip — those are the ones to re-read.
- Join the community channel; introduce yourself with a one-line goal.

**Deliverable:** A README in `00-orientation/` listing your stack, model versions, and the niche you intend to target.

**Success criteria:** You can produce one image and one 5-second clip on demand without consulting docs.

---

## Pillar 1 — AI Influencer Pipeline (Weeks 1–2)

### Week 1 — End-to-end pipeline walkthrough

**Goal:** Run the full pipeline once, badly, on purpose. Understand the seams.

- Watch the core pipeline tutorials in the Blueprint.
- Map the pipeline as a directed graph: idea → script → persona → shots → motion → voice → edit → publish → analytics.
- For each node, note: input format, output format, the tool you'll use, average runtime, and failure modes.

**Lab:**
1. Pick one niche (skincare, fitness, finance, etc.). Lock it for the whole curriculum.
2. Produce one 20–30 second UGC-style video about a hypothetical product, end-to-end, in a single afternoon. Don't polish — finish.

**Deliverable:** `01-pipeline/v1.mp4` plus `pipeline-map.md` (the graph).

**Success criteria:** You can name, in order, every stage and the file format it hands to the next.

### Week 2 — Bottleneck analysis and rework

**Goal:** Identify the two slowest and the two lowest-quality stages in your pipeline and fix them.

- Time every stage of Week 1's video with a stopwatch. Don't estimate — measure.
- Rate each output 1–5 on quality.
- Two slowest stages get an automation plan (foreshadowing Week 9).
- Two lowest-quality stages get a craft plan (which pillar week they map to).

**Lab:** Rebuild the Week 1 video, attacking only the four flagged stages. Keep the rest identical so you can A/B.

**Deliverable:** `01-pipeline/v2.mp4` + a one-page retro: what got faster, what got better, what got worse.

**Success criteria:** v2 is measurably better on at least three of the four flagged stages.

---

## Pillar 2 — Photoreal AI Persona Construction (Weeks 3–4)

### Week 3 — Persona identity & consistency

**Goal:** Build one AI persona with locked, reproducible visual identity across 50+ images.

- Study the Blueprint's persona modules and the advanced consistency tutorials.
- Build a **Persona Bible**: face seed/LoRA, age, height/build proxy, hair, eye color, skin tone, wardrobe palette, voice profile, vocal mannerisms, backstory, *and* what they will never do/say.
- Train or curate a consistency mechanism: LoRA, IP-Adapter face reference, or character sheet workflow.

**Lab:** Generate a 50-image consistency sheet — same person, varied poses, lighting, expressions, environments. Score consistency 1–5 per image; aim for ≥4 average.

**Deliverable:** `02-persona/persona-bible.md` + `02-persona/sheet/` (50 images).

**Success criteria:** A stranger viewing 10 random images guesses "same person" 9+ times.

### Week 4 — Uncanny-valley elimination

**Goal:** Pass three independent reviewers' "is this real?" check on at least 7 of 10 stills and 5 of 10 short clips.

- Catalog the common tells: rubbery skin, dead eyes, hand artifacts, hairline halo, perfect symmetry, identical iris pattern, motion drift.
- Build a fix recipe per tell: inpainting passes, micro-noise/grain, controlled asymmetry, hand fix workflow, eye highlight injection.
- Add a "human pass" finishing step to your pipeline (Photoshop/Affinity micro-edits, frame-level retouches on hero shots).

**Lab:** Produce 10 stills and 10 5-second clips of your persona. Run a blinded test with three reviewers (community swap).

**Deliverable:** `02-persona/realism-test/` with results CSV.

**Success criteria:** ≥70% "real" votes on stills, ≥50% on clips. Document every tell you couldn't fix yet — that's your backlog.

---

## Pillar 3 — Viral UGC with Real Products (Weeks 5–6)

### Week 5 — Authentic-feeling product UGC

**Goal:** Produce UGC that looks shot on a phone, in a real environment, with a real product placement, conveying credible emotion.

- Study the Blueprint's UGC modules: hooks, beats, pacing, the "first 1.5 seconds" rule, native-platform feel.
- Decompose 20 top-performing organic UGC videos in your niche. Per video, log: hook type, beat count, emotion arc, B-roll ratio, CTA style, length.
- Build a **Hook Library** of 30 hook templates and an **Emotion Beat Library** of 15 micro-moments (laugh, sigh, "wait what", reaction frame, etc.).

**Lab:** Produce three 20–40s UGC videos for the same hypothetical product, varying only the hook. Keep persona, product, and CTA constant.

**Deliverable:** `03-ugc/A.mp4`, `B.mp4`, `C.mp4` + a one-pager comparing them.

**Success criteria:** Each video is recognizably UGC, not "ad". You can articulate, in writing, why one hook will likely outperform the others.

### Week 6 — Product integration & emotion at scale

**Goal:** Real-looking product handling, lighting match, and emotional authenticity — repeatable across SKUs.

- Build a **Product Shot Workflow**: clean plate of the product, persona generation in a matching environment, compositing/relighting pass, micro-handling motion.
- Lock an **Emotion Reference Set**: short reference clips of the *feeling* you want, used as motion/expression guides.
- Add a "credibility pass" checklist: shadow direction, color temperature match, scale plausibility, reflection sanity.

**Lab:** Produce one UGC video each for three different fictional products in your niche. Same persona, three SKUs.

**Deliverable:** `03-ugc/sku1.mp4`, `sku2.mp4`, `sku3.mp4` + credibility-pass checklist filled per video.

**Success criteria:** Three peer reviewers can't reliably tell which product is real and which is composited.

---

## Pillar 4 — Brand-Consistent Visual Generation (Week 7)

### Week 7 — Brand system for AI visuals

**Goal:** Lock a brand visual system that survives prompt drift across ads, reels, and feed posts.

- Define **Brand Tokens**: color palette (hex), typography rules, lighting style, lens style (focal length proxy), composition rules, motion vocabulary, voice/tone for captions.
- Encode tokens as **reusable prompt fragments** (text snippets, style references, and where possible, LoRAs).
- Build a **Brand QA Sheet**: 12 checks every asset must pass before publish.

**Lab:** Produce a 9-asset campaign in three formats — 3 ad creatives (1:1), 3 reels (9:16), 3 feed posts (4:5) — for one product, fully on-brand.

**Deliverable:** `04-brand/system.md` + `04-brand/campaign/` (9 assets).

**Success criteria:** Lay the 9 assets in a grid; a reviewer recognizes them as one brand without being told.

---

## Pillar 5 — Throughput & Optimization (Week 8)

### Week 8 — Personal content factory

**Goal:** Produce more content in one afternoon than a typical small team does in a week — without quality regression.

- Adopt a **batch-stage workflow**: do every prompt-write task in one block, every image task in one block, every motion task in one block, every voice task in one block, every edit task in one block. Stop context-switching.
- Build **prompt templates with variables**: one master template per format, parameterized by hook, product, persona variant.
- Standardize **asset naming**: `{date}-{persona}-{format}-{variant}.{ext}`. No exceptions.
- Track unit economics: time per asset, render cost per asset, edit cost per asset.

**Lab:** In one 4-hour block, ship 12 finished short-form videos with at least 3 distinct hooks and 2 distinct products.

**Deliverable:** `05-throughput/batch-log.md` (timestamps + counts) + 12 published-quality videos.

**Success criteria:** Average time-per-finished-video ≤ 20 minutes, with QA pass rate ≥ 80%.

---

## Pillar 6 — Claude Code Automation for Content Systems (Weeks 9–10)

### Week 9 — Claude Code Integration Guide

**Goal:** Stand up a Claude Code workspace that runs your content tooling: scripts, prompt libraries, renders, QA, and bookkeeping.

- Work through the Blueprint's Claude Code Integration Guide end-to-end.
- Set up a repo: `prompts/`, `personas/`, `pipelines/`, `scripts/`, `outputs/`, `qa/`, `analytics/`.
- Add a `CLAUDE.md` describing your stack, conventions, and where Claude Code should and shouldn't act.
- Wire **slash commands** for repeatable jobs: `/new-script {hook} {product}`, `/persona-sheet`, `/brand-qa {asset}`, `/batch-render {csv}`.
- Configure **hooks** for guardrails: pre-commit asset-naming check, post-render QA gate, "no-publish-without-disclosure" lint.

**Lab:** Convert three manual workflow steps from Pillar 5 into Claude Code commands.

**Deliverable:** `06-claude-code/` repo with at least 3 working slash commands and 1 hook, plus a `runbook.md`.

**Success criteria:** You can re-run any of those three steps with a single command, idempotently.

### Week 10 — Refine, scale, and self-improve

**Goal:** A pipeline that learns. Outputs feed back into the inputs.

- Build a **performance ledger**: a CSV/SQLite of every shipped asset with hook, persona, format, product, platform, views, watch-time, CTR, conversions if available.
- Use Claude Code to (a) ingest ledger entries, (b) compute leaderboards per hook/persona/format, (c) propose next week's prompt templates based on what's winning.
- Add an **error-budget loop**: any QA failure must produce either a prompt-template fix or a hook (pre-render check) so it can't recur.

**Lab:** Run a 7-day publishing cadence — 2 assets/day, 14 total — with the ledger updating after each. End the week with a Claude Code–generated "next-week plan".

**Deliverable:** `06-claude-code/ledger.csv` + `06-claude-code/next-week-plan.md`.

**Success criteria:** The next-week plan cites at least three specific signals from the ledger and proposes concrete prompt changes.

---

## Pillar 7 — Advanced Prompt Engineering (Week 11)

### Week 11 — Commanding the models

**Goal:** Drop fluff, raise precision. Squeeze quality out of the same models everyone else is using.

- Master the structure of a high-precision prompt: **subject → action → environment → camera → lens → light → mood → style → negatives → constraints**.
- Learn weighted prompting and prompt scheduling per model (Midjourney/Flux/SD specifics differ — keep a per-model cheat sheet).
- Practice **prompt diffs**: change one variable at a time, document the visual delta.
- Build a **prompt grammar** in your repo: a typed schema (Python/TS) that compiles structured inputs into final prompts per target model.
- Apply the same rigor to **video and voice prompting**: motion verbs, camera moves, cadence, pause directives, emphasis markers.

**Lab:**
1. Take five prompts you wrote in Weeks 1–8. Rewrite each using the structured grammar.
2. Render both old and new versions. Score each on a 1–5 rubric across composition, lighting, subject fidelity, mood, prompt adherence.

**Deliverable:** `07-prompts/grammar.ts` (or `.py`) + `07-prompts/diffs.md` with before/after stills and scores.

**Success criteria:** Average score improves by ≥1 point with no increase in render time or cost.

---

## Capstone — Week 12

**Goal:** Ship a real campaign that proves mastery of every pillar.

- Pick one product (fictional or, with permission, real). Build a one-week campaign:
  - 1 persona, fully consistent
  - 1 brand system, fully applied
  - 10 short-form videos: 3 hooks × 3 SKU angles + 1 longer "hero" piece
  - 6 static creatives across feed and ad sizes
  - 1 voice-driven explainer
- Run every asset through the Claude Code QA pipeline.
- Publish (test account is fine) and capture a 72-hour performance snapshot.

**Deliverable:** `12-capstone/` containing the campaign, the ledger snapshot, and a 1-page post-mortem.

**Mastery rubric (score yourself, then have two peers score you):**

| Pillar | Score 1–5 | Evidence |
| --- | --- | --- |
| Pipeline | | one-command rebuild from scratch |
| Persona | | 90%+ "real" votes on stills |
| UGC | | 3 hook variants per SKU |
| Brand | | grid-recognition test passes |
| Throughput | | ≤ 20 min/video |
| Claude Code | | 5+ commands, ≥1 hook, ledger live |
| Prompt eng. | | structured grammar in production |

**You're done when** at least 6 of 7 pillars score ≥4, *and* one peer scores you ≥4 on the campaign overall.

---

## Continuous Operating Rhythm (after Week 12)

- **Daily (15 min):** ledger review; one prompt tweak.
- **Weekly (90 min):** read live-update feed; patch one workflow; ship a retro.
- **Monthly (3 hours):** rebuild the worst-performing stage of the pipeline from scratch. Persona retrain check. Brand drift audit.
- **Quarterly (1 day):** kill or rebrand any persona under threshold. Re-baseline tooling.

## Community Engagement Plan

- **Friday post:** the week's deliverable + one specific question.
- **Sunday review:** two peer deliverables with one concrete suggestion each.
- **Monthly office-hour:** bring one stuck workflow; leave with a fix or a fallback.
- **Quarterly swap:** trade prompt grammars and Claude Code command sets with one peer; integrate the best one of theirs into yours.

## Risk & Ethics Checklist (revisit before every campaign)

- [ ] No real-person likeness without written consent.
- [ ] AI disclosure on every published asset per platform policy.
- [ ] No fabricated testimonials, medical/financial claims, or before/after fakery for real products.
- [ ] Music/asset licensing verified.
- [ ] Persona's "never do/say" list reviewed.
- [ ] Data: no PII in prompts or repos.

---

*This curriculum is opinionated on purpose. Adjust pacing to your time budget, but do not skip the labs — the deliverables are the curriculum.*
