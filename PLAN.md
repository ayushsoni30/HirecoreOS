# PLAN: Landing Page Overhaul, AI Model Branding & Vercel SPA Routing

This document details the architectural plan, UX refinements, and Pull Request summary for commit [`7ab59f5`](https://github.com/rishhbh/hirecore-os/commit/7ab59f56d5de0a835cec0db7c032b317cd808aca).

---

## 1. Executive Summary

This update focuses on standardizing the HireCore OS frontend layout, streamlining navigation across mobile and desktop viewports, updating core AI model branding, and configuring production-ready SPA routing for Vercel deployments.

### Key Deliverables
* **Vercel SPA Fallback Configuration**: Resolved direct-link `404: NOT_FOUND` errors on Vercel deployments by introducing URL rewrite rules (`vercel.json`).
* **Navbar Layout & Mobile UX Refactor**: Streamlined the top navigation bar, removed redundant links, added a dedicated mobile back-to-home navigation button, and shortened page titles.
* **Hero Section Grid & Vertical Alignment**: Restructured the landing page hero into a 12-column grid system with balanced vertical padding and structured system manifest cards.
* **AI Model Branding Synchronization**: Updated all UI labels and technical documentation to accurately reflect the **Cerebras GPT-OSS-120B** inference engine.

---

## 2. Comprehensive Breakdown of Changes

### A. Single-Page Application (SPA) Vercel Routing (`vercel.json` & `client/vercel.json`)
* **Problem**: Navigating directly to routes like `/dashboard`, `/privacy`, or `/terms` (or refreshing the browser on deep links) caused Vercel to look for static files at those paths, resulting in a Vercel-native 404 error page.
* **Solution**: Introduced `vercel.json` rewrites at both the repository root and `client/` directory level:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
  This guarantees that all route requests are routed through `index.html`, allowing React Router to handle client-side rendering.

### B. Top Navigation Bar Refactor (`client/src/components/Navbar.jsx` & `App.jsx`)
* **Link Consolidation**: Removed redundant `[00] Overview` and `[06] About Team` pills from the left-hand navigation bar strip. Integrated `About · Privacy · Terms` as a compact monospaced text group in the right status bar.
* **Mobile View Optimization**:
  * Hidden the HireCore OS logo image and text block on mobile screens (`hidden sm:flex`) to eliminate header crowding.
  * Added a dedicated `ArrowLeft` back-to-home button (`sm:hidden`) linking to `/landing` (public) or `/dashboard` (authenticated).
  * Kept the `<h1>` title element as plain non-clickable text for visual clarity.
* **Punchy Navigation Titles (`App.jsx`)**:
  * `/landing` ➔ `System Overview`
  * `/about` ➔ `About Team`
  * `/dashboard` ➔ `Dashboard`
  * `/resume-analyzer` ➔ `Resume Analyzer`
  * `/tech-interview` ➔ `Tech Practice`
  * `/resume-interview` ➔ `CV Oral Exam`
  * `/tech-buddy` ➔ `Tech Buddy AI`

### C. Hero Section Grid & Vertical Positioning (`client/src/pages/LandingPage.jsx`)
* **12-Column Grid Layout**: Converted the hero section to `grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch`. The main headline occupies `lg:col-span-8` while the system manifest card occupies `lg:col-span-4`.
* **Structured System Manifest Card**: Replaced unstructured line breaks with a clean key-value monospaced grid displaying `System Status` (Operational with live indicator), `AI Inference` (`Cerebras GPT-OSS-120B`), and `Security` (`JWT + Google OAuth`).
* **Vertical Positioning**: Adjusted container top padding (`pt-6 sm:pt-12 md:pt-16`) to position the hero section naturally in the vertical center of the screen.
* **Feature Index Grid**: Formatted the 6 feature chips into a responsive `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` grid with `shrink-0` tags to prevent text wrapping.

### D. AI Model Branding & Documentation (`LandingPage.jsx` & `README.md`)
* Synchronized model references across the landing page and `README.md` to specify **Cerebras GPT-OSS-120B**.
* Updated directory tree in `README.md` to document `client/vercel.json`.

---

## 3. Pull Request (PR) Description Template

Below is the structured description for opening a Pull Request for commit `7ab59f5`:

```markdown
## 🚀 Pull Request: Landing Page Overhaul, AI Model Branding & Vercel SPA Configuration

### 📝 Description
This PR resolves deep-link SPA 404 errors on Vercel deployments, overhauls the landing page hero section for improved vertical and horizontal alignment, simplifies the navbar layout across mobile/desktop viewports, and synchronizes AI model branding to **Cerebras GPT-OSS-120B**.

---

### 🔧 Changes Included

#### 1. ⚙️ Vercel Deployment & SPA Rewrites
- Added `client/vercel.json` and `vercel.json` with route rewrite rules to redirect all incoming routes (`/(.*)`) to `/index.html`.
- Fixes Vercel 404 errors when directly opening or refreshing `/dashboard`, `/privacy`, `/terms`, etc.

#### 2. 🎨 Navbar & Mobile Navigation Refactor
- **Clutter Reduction**: Removed redundant navigation buttons from the left strip; unified `About · Privacy · Terms` in the right status bar.
- **Mobile View Alignment**: Hidden brand logo on `< sm` screens (`hidden sm:flex`); added a dedicated `ArrowLeft` back-to-home button for mobile users.
- **Title Optimization**: Shortened active page titles in `App.jsx` (e.g. `System Overview`, `Resume Analyzer`, `CV Oral Exam`, `Tech Buddy AI`) with `truncate` support.

#### 3. 📐 Hero Section & System Manifest Overhaul
- Converted hero layout to a 12-column responsive grid (`lg:grid-cols-12`).
- Formatted right-side system status card with structured monospaced key-value metrics and an aligned CTA button.
- Adjusted vertical padding (`pt-6 sm:pt-12 md:pt-16`) for optimal screen centering.
- Refactored feature index pills into a responsive `grid-cols-6` layout.

#### 4. 🧠 Model Branding & Docs Update
- Updated AI engine display strings to **Cerebras GPT-OSS-120B** across `LandingPage.jsx` and `README.md`.
- Updated repository structure tree in `README.md`.

---

### 🧪 Verification & Testing

- [x] **Linting**: Verified codebase integrity with `npm run lint` inside `client/` (0 errors, 0 warnings).
- [x] **Routing Test**: Tested direct route reloads for `/landing`, `/about`, `/privacy`, `/terms`, `/dashboard`.
- [x] **Responsive Layout**: Verified header, hero grid, and back button across mobile (`375px`), tablet (`768px`), and desktop (`1440px`).
```

---

## 4. Modified Files Matrix

| File Path | Description of Changes |
| :--- | :--- |
| `vercel.json` | **[NEW]** Root Vercel SPA rewrite config (`/(.*)` ➔ `/index.html`) |
| `client/vercel.json` | **[NEW]** Client Vercel SPA rewrite config |
| `client/src/components/Navbar.jsx` | Mobile logo hiding, mobile `ArrowLeft` back link, legal bar consolidation |
| `client/src/App.jsx` | Shortened `getPageTitle` strings for clean navbar rendering |
| `client/src/pages/LandingPage.jsx` | 12-col hero grid, status card key-value metrics, model branding update |
| `README.md` | Model name updates & `vercel.json` directory tree addition |

---

## 5. Next Steps

1. **Vercel Project Settings**: Verify the build output directory is set to `dist` and root directory is set appropriately in the Vercel dashboard.
2. **Environment Variables**: Confirm `CEREBRAS_API_KEY` and `CEREBRAS_MODEL=gpt-oss-120b` are configured in production environment settings.
