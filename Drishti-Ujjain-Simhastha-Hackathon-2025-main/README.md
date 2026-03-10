# Project DRISHTI

Digital Response & Intelligence System for Holistic Threat Interception

**Registration Number:** TH12915  
**Team:** Team Aashu  
**Theme:** Theme 2 – Safety, Security & Surveillance

![Stack](https://img.shields.io/badge/Stack-React%20%2B%20TypeScript%20%2B%20Vite-blue)
![UI](https://img.shields.io/badge/UI-TailwindCSS-38BDF8)
![Maps](https://img.shields.io/badge/Maps-Leaflet%20%2F%20Mapbox-1E9F75)
![Status](https://img.shields.io/badge/Status-Hackathon%20Prototype-orange)

---

## 1. Executive Summary

Mass religious gatherings (e.g. Simhastha Kumbh 2028, Ujjain) require real‑time situational awareness, predictive crowd risk modelling, coordinated logistics, and rapid multi‑channel response. Project DRISHTI is a unified Command & Intelligence Dashboard that fuses simulated (extensible to live) telemetry (crowd density, drones, SOS, choke points, logistics, service health, communications) into an adaptive, themeable, performance‑tuned interface. It is engineered for clarity under stress, with predictive assist ("Samanjasya / Vishwas / Suraksha" AI advisory model concept) and modular expansion readiness.

## 2. Core Value Propositions

1. Situational Fusion: One pane for crowd, risk, resource, and operational layers.
2. Predictive Prevention: Choke point risk scores + 15/30 min density projections.
3. AI Assist Hooks: Extensible modal workflow for AI‑generated interventions & approvals.
4. Operational Efficiency: Drone fleet overview, logistics depletion ETAs, service uptime.
5. Communication Integrity: Central announcements & rumor-control readiness.
6. Rapid Theming & Presentation: Accent palette + glass morphism for stakeholder demos.
7. Offline‑Ready Design (planned): Architecture prepared for progressive enhancement & caching.

## 3. Feature Matrix (Implemented)

| Domain | Key Features |
|--------|--------------|
| Live Map | Dual engine (Leaflet fallback + optional Mapbox), animated pilgrims, heat layer, choke point markers, sector polygons |
| KPI Ribbon | Continuous marquee: Threat Level, Crush Risk Index, Supply Sufficiency %, Drone Coverage %, Rising Sectors, Median Response SLA |
| Predictive Crowd | Sector density now / +15 / +30 with trend classification |
| Choke Points | Risk score + time‑to‑issue ETA |
| Drone Fleet | Status, task, battery, sector assignment, ETAs |
| Logistics | Stock levels, depletion time forecasts, low‑stock flagging |
| SOS / Alerts | Simulated incoming alerts + AI advisory modal (approve / reject workflow) |
| System Health | Latency, error rates, service status heat semantics |
| Communications | Multi-channel announcement logs & approvals |
| Theming | 6 accent palettes, glass mode toggle, persistent localStorage |
| Responsiveness | Mobile bottom sheet panel, condensed metric strip, adaptive layout |
| Performance | Code-splitting (lazy views), dynamic map engine loader, selective re-rendering |

## 4. Technology Stack

| Layer | Implementation |
|-------|---------------|
| Frontend Framework | React 18 + TypeScript + Vite |
| Styling | TailwindCSS, custom accent system, glass mode utility classes |
| Motion | Framer Motion (entrances, panel transitions, KPI marquee) |
| Mapping | Leaflet + leaflet.heat (default), optional Mapbox-GL (dynamic import) |
| Charts | Recharts (lightweight compositional charts) |
| Data Simulation | Faker.js seeded dynamic generators (extensible to APIs) |
| State | Context API (App & Theme contexts) |
| Build / Deploy | Vite build, Netlify deploy config (SPA redirect + asset caching) |

## 5. Architecture Overview

```text
src/
    components/      Core UI modules (map wrappers, panels, ribbon, modals)
    components/views Domain views (Analytics, Logistics, Drones, etc.)
    contexts/        AppContext (UI state), ThemeContext (accent/glass)
    utils/           mockData generator (telemetry + predictive synthesis)
    hooks/           Responsive/media preference utilities
```

Separation ensures: (1) modifiability per domain, (2) lazy loading for heavy views, (3) theming decoupled from business logic, (4) future substitution of mock generators with real API clients.

## 6. Data Simulation Model

The generator (`mockData.ts`) synthesizes:
- Crowd density per sector with peak-hour shaped baselines
- Short-horizon predictive density (now / +15 / +30) with trend classification
- SOS alerts & spatial scatter via radial randomization
- Drone operational states + battery + ETA logic
# PROJECT DRISHTI  
Digital Response & Intelligence System for Holistic Threat Interception

**Registration Number:** TH12915  
**Team:** Team Aashu  
**Theme:** Theme 2 – Safety, Security & Surveillance

![Stack](https://img.shields.io/badge/Stack-React%20%2B%20TypeScript%20%2B%20Vite-0A84FF) ![UI](https://img.shields.io/badge/UI-TailwindCSS-38BDF8) ![Maps](https://img.shields.io/badge/Maps-Leaflet%20%7C%20Mapbox-1E9F75) ![AI Ready](https://img.shields.io/badge/AI-Assist%20Hooks-purple) ![Status](https://img.shields.io/badge/Status-Hackathon%20Prototype-orange)

*A next‑generation command & intelligence dashboard engineered for extreme crowd management, proactive risk interception, and multi‑agency coordination.*

---

## Table of Contents

1. Executive Pitch  
2. Why It Matters  
3. Live Capability Snapshot  
4. Architecture  
5. Data Synthesis Model  
6. Mapping Strategy  
7. KPI Intelligence Layer  
8. UX & Theming  
9. Quick Start  
10. Deployment  
11. Roadmap  
12. Extensibility Hooks  
13. Team  
14. Performance Engineering  
15. Current Limitations  
16. Contributing (Hackathon Phase)  
17. License & Usage  
18. Command Cheat‑Sheet  
19. Visual Showcase (Placeholders)  
20. Strategic Summary

---

## 1. Executive Pitch

Project DRISHTI unifies crowd telemetry, drone operations, predictive congestion modelling, logistics awareness, system health, and communication control into a single high‑clarity operational surface. It transforms reactive monitoring into *anticipatory governance*—surfacing emerging choke points, resource depletion risk, and intervention suggestions with AI advisory hooks ready for real model integration.

> DRISHTI = Situational Fusion + Predictive Foresight + Action Orchestration

## 2. Why It Matters

Mass gatherings (e.g. Simhastha Kumbh 2028) compress volatility: human density, misinformation, resource strain, and safety risks. Fragmented dashboards slow response. DRISHTI provides:

- Proactive: 15–30 min density forecasts and choke point ETAs.  
- Cohesive: Operational + predictive + communication layers in one frame.  
- Extensible: Mock generators can be swapped for real feeds (WebSocket, MQTT, REST).  
- Presentation‑Ready: Theming + glass aesthetics for stakeholders & command briefings.  
- AI‑Ready: Structured approval pipeline for model‑suggested interventions.

## 3. Live Capability Snapshot

| Domain | Implemented Highlights |
|--------|------------------------|
| Live Map | Dual engine (Leaflet default, Mapbox optional), sector polygons, animated pilgrims, heat layer, choke point markers |
| Predictive Crowd | Sector now / +15 / +30 density & trend classification |
| Choke Points | Risk score (0–1), time‑to‑issue ETA aggregation |
| Drone Fleet | Status, task, battery, sector assignment, ETAs |
| Logistics | Stock levels, depletion ETA minutes, low‑stock surfacing |
| SOS / Alerts | Simulated SOS + AI advisory modal (approve / reject) |
| Communications | Multi-channel announcements with approval flags |
| System Health | Latency + error rate + status banding |
| KPI Ribbon | Continuous marquee of mission-critical indices |
| Theming | 6 accent palettes + glass mode persistence |
| Responsiveness | Mobile bottom sheet + compact metric strip |
| Performance | Lazy loaded views + dynamic map engine selection |

## 4. Architecture

```
src/
    components/          Core UI primitives & composite modules
    components/views     Domain views (analytics, drones, logistics, etc.)
    contexts/            AppContext (UI state), ThemeContext (accent/glass)
    utils/               mockData.ts (synthetic telemetry + predictions)
    hooks/               Responsive media query helpers
```

Design Principles:
- Isolation of domain views for code‑splitting.  
- Predictive + operational data normalized into one generator.  
- Theming decoupled (context + utility class mapping).  
- Map engine abstraction (conditional Mapbox import prevents bundle bloat).  

## 5. Data Synthesis Model

`mockData.ts` synthesizes:

- Crowd density baseline shaped by peak hour windows.  
- Predictive horizon (now / +15 / +30) with trend label.  
- SOS scatter (geo‑distributed).  
- Drone operational state machine + ETAs + battery.  
- Logistics depletion trajectory (minutes to depletion).  
- Service health (latency + error envelope).  
- Choke point emergent risk scoring & ETA.  
- Announcement feed with AI/human approval signals.

> Swap Strategy: Replace faker factories with ingestion adapters (REST/WebSocket) returning identical object structure—no downstream refactor.

## 6. Mapping Strategy

| Mode | Purpose |
|------|---------|
| Leaflet (default) | Tokenless, open, light runtime—ideal for demos |
| Mapbox (optional) | Higher fidelity vector tiles if `VITE_MAPBOX_TOKEN` present |

Dynamic import loads Mapbox only when a token exists—optimizing initial payload for most deployments.

## 7. KPI Intelligence Layer

Formulas (simplified in prototype):

```text
Crush Risk Index        = avg(chokePoint.riskScore) * 100
Supply Sufficiency %    = sum(logistics.current) / sum(logistics.max) * 100
Drone Coverage %        = activeNonIdleDrones / totalDrones * 100
Rising Sectors (15m)    = count(predictions where trend=rising AND plus15>0.7)
Median Response SLA     = avgResponseTime (placeholder – future percentile calc)
```

All KPIs stream into a marquee ribbon for continuous passive scanning—reducing cognitive shift.

## 8. UX & Theming

| Aspect | Detail |
|--------|--------|
| Accents | Blue · Cyan · Emerald · Amber · Violet · Rose |
| Glass Mode | Translucent layering, ambient gradient wash, subtle depth shadows |
| Persistence | `localStorage` keys: `drishti:accent`, `drishti:glass` |
| Mobile Adaptation | Bottom sheet (Right Panel), collapsible sidebar, condensed metrics |
| Motion | Framer Motion (entrances, ribbon scroll, interactive panels) |

> Philosophy: High data density without visual fatigue—leveraging contrast hierarchy, subtle gradient energy, and motion as *state context*, not decoration.

## 9. Quick Start

### Prerequisites

- Node.js 18+

### Install & Run

```bash
npm install
npm run dev
```

Open: <http://localhost:5173>

### Production Build & Preview

```bash
npm run build
npm run preview
```

### Optional: Mapbox Enablement

Create `.env`:

```dotenv
VITE_MAPBOX_TOKEN=pk.your_token_here
```

Map engine auto‑switches if token is present at build time.

## 10. Deployment

Netlify ready (`netlify.toml`):

- SPA redirect (`/* -> /index.html`)  
- Long‑cache immutable static assets  
- HTML no‑cache for fresh hydration  

Push to Git → configure Netlify → deploy.

## 11. Roadmap (Next Wave)

- Directional crowd flow vectors & path pressure visualization.  
- Clustered pilgrim density with drill‑down.  
- Time scrubber & replay (temporal reconstruction).  
- WebSocket ingestion (live drones, SOS, service events).  
- PWA (offline snapshot + installable shell).  
- Streaming AI advisory (LLM token streaming UI).  
- Pilgrim companion mobile micro‑app (guidance + SOS).  
- Role‑segmented dashboards (Logistics / Security / Medical).  
- Incident timeline export (PDF / CSV).  

## 12. Extensibility Hooks

| Module | Replace With |
|--------|--------------|
| Mock Generators | REST/WebSocket adapters (shape parity required) |
| AI Alert Modal | Real inference endpoint (stream + approve) |
| Drone Fleet | Telemetry broker (MQTT/Kafka → WebSocket) |
| Map Overlays | Plugin layer registry (future) |
| KPI Engine | Dedicated analytics microservice |

## 13. Team (Team Aashu)

| Name | Role |
|------|------|
| Ayush Kumar Biswal | Project Lead & Researcher |
| Smruti Ranjan Senapati | UI/UX & Mobile App Developer |
| Omkar Mahapatro | Backend Developer |
| Subrat Kumar Majhi | AI/ML Specialist |

## 14. Performance Engineering

- Lazy boundaries for each heavy domain view.  
- Dynamic Mapbox import avoids ~1.6MB overhead by default.  
- GPU‑friendly transforms (marquee) over expensive layout thrash.  
- Lightweight charting (Recharts) for predictable render cycles.  
- State slicing—context kept lean (no oversized global stores).  

## 15. Current Limitations

| Category | Current State |
|----------|---------------|
| Data Authenticity | Fully synthetic (no real telemetry yet) |
| AI Layer | Advisory suggestions stubbed (rules + randomization) |
| Auth / RBAC | Not implemented (planned OIDC/JWT) |
| Persistence | No server‑side state—session ephemeral |
| Offline | PWA/service worker pending |
| Audit Trail | Not yet tracking operator approvals persistently |

## 16. Contributing (Hackathon Phase)

External contributions are paused until judging completes. Post‑event: open PR with scope, rationale, and performance impact note.

## 17. License & Usage

Hackathon evaluation prototype. For production adaptation or redistribution, obtain written consent from **Team Aashu**. A formal open‑source license may be applied post‑hackathon.

## 18. Command Cheat‑Sheet

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check & build
npm run build

# Preview production build locally
npm run preview
```

## 19. Visual Showcase (Placeholders)

Add screenshots / GIFs:  
- Live Operational Map  
- KPI Ribbon (scrolling)  
- Drone Fleet Panel  
- Logistics Depletion View  
- Theme Palette & Glass Mode  

## 20. Strategic Summary

Project DRISHTI elevates command oversight from reactive dashboards to forward‑looking orchestration—merging predictive risk, operational telemetry, and human approval loops in a presentation‑ready, extensible shell built for real-world scalability.

---

© Team Aashu – Simhastha Hackathon Submission (Reg. TH12915)
