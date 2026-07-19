# 🌌 RetailFlow OS (Fluxa Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Platform](https://img.shields.io/badge/platform-React%20%7C%20Vite%20%7C%20Firebase-lightgrey.svg)]()

### **Enterprise-Grade SME Intelligence, Dynamic Commerce, & Autonomous Google Workspace Orchestration**

**RetailFlow OS** is an open-source business operation and customer intelligence platform designed to empower Small and Medium Enterprises (SMEs). Built with the highly refined, high-contrast, light-themed **Fluxa Design System**, it combines visual elegance with high-impact utility.

The platform bridges the gap between interactive lead-generation diagnostics, dynamic retail checkout, and automated scheduling systems, solving a critical conversion bottleneck: **Google OAuth authorization friction**. By implementing a secure **Single-Admin Shared Integration Architecture**, customers complete assessments, shop for high-ticket items, chat with an AI copilot, and book live sessions with auto-generated Google Meet video rooms—all without ever encountering a Google OAuth prompt.

---

## 💎 The Vision & Core Greatness

Traditional enterprise systems are fragmented, requiring distinct pipelines for CRM, scheduling, checkout, and client diagnostics. They introduce high friction, forcing clients through multiple browser tabs, app downloads, and login sequences.

**RetailFlow OS** consolidates this entire workspace into a unified, fluid, single-screen operational hub:

1. **SME Diagnostic Funnel**: An elegant, responsive, multi-step assessment that evaluates operational health, calculates growth scores client-side, and delivers immediate diagnostic value to leads.
2. **Dynamic Retail Storefront**: A customer-facing catalog optimized for premium electronics, featuring local delivery logic (Lagos express fleet), volume discounts, custom promotional codes, and live delivery trackers.
3. **Aisha AI Concierge**: An embedded shopper copilot powered by natural language processing, assisting buyers with live product recommendations, item comparison (e.g. MacBook vs. Chromebook), and instant in-chat "Add to Cart" checkout actions.
4. **Zero-Friction Master Scheduling**: Customers reserve virtual sessions directly onto the business master calendar. The system auto-injects dynamic Google Meet links and records assessment metrics into a centralized Google Sheets ledger.
5. **Real-time Competitor Benchmarking**: An integrated scraper dashboard benchmarking active prices from major regional electronics competitors (Slot, Pointek, Jumia), enabling merchants to invoke dynamic 1-click price beating algorithms.

---

## 🎨 Visual Identity & UX Engineering

RetailFlow OS features the **Fluxa Design System**—a modern light-mode design language designed to maximize readability, maintain visual balance, and encourage customer conversion:

* **High-Contrast Slate-White Theme**: Soft off-white backdrops (`bg-slate-50`, `bg-white`) paired with sharp obsidian-colored slate text (`text-slate-950`) and deep blue interactive anchors (`text-blue-700`).
* **Symmetric Geometric Framing**: Elegant borders, container lines, and structural sidebars that focus user attention on interactive elements while maintaining spacious negative padding.
* **Fluid UI Physics**: Native, responsive enter animations and layout transitions (using `motion` and keyframes) that respond to click gestures with satisfying tactical responses.
* **Responsive Density**: Tailored for both high-density desktop dashboards (sidebars, multi-column analytics, bento-grids) and comfortable mobile touch targets (44px standard).

---

## ⚙️ System Architecture & Data Flow

At the core of RetailFlow OS is its secure credential proxying strategy. The owner performs a secure Google Workspace authentication **once** inside the protected Admin panel. The resulting OAuth token and spreadsheet targets are saved securely in Firestore. Client-side customer actions are then proxied and authorized on behalf of the company instantly.

```text
 ┌─────────────────────────────────────────────────────────────┐
 │                         CLIENT VIEW                         │
 │  • Takes 9-Step Assessment & Shops Premium Electronics      │
 │  • Chats with Aisha AI Concierge & Confirms Cart Checkout   │
 │  • Reserves Calendar Booking (Ikeja/Lekki Logistics)        │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                     1. Fetch Active Admin Credentials
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                     FIREBASE FIRESTORE                      │
 │  • Securely houses leads, customer logs, and orders         │
 │  • Persists active Admin OAuth config & sheets token        │
 │  • Syncs data securely across devices                       │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                     2. Invoke Proxied Workspace APIs
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                   GOOGLE WORKSPACE ENGINE                   │
 │  • Google Calendar: Schedules live booking slot             │
 │  • Google Meet: Auto-injects unique virtual video room      │
 │  • Google Sheets: Appends full lead response matrix          │
 └─────────────────────────────────────────────────────────────┘
```

### Architectural Highlights:
* **OAuth Token Siphoning**: Eliminates the requirement for the consumer to have or log into a Google account. The system reads and schedules slots on the business calendar seamlessly using the stored token.
* **Fail-Safe Client Caching**: Uses robust local fallback state managers (`localStorage`). If network exceptions or API limits are met, client assessments and cart structures are preserved safely to prevent data loss.
* **Adaptive Price Optimization**: The competitor benchmarking module queries live APIs and suggests margin tuning steps. A single click calculates optimal undercuts to keep products positioned competitively.

---

## 🛠️ Built with the Modern Open-Source Stack

* **React 18** — High-fidelity declarative view components and robust hook states.
* **Vite** — Lightning-fast build speeds and static asset compilation.
* **Tailwind CSS** — Utilitarian, low-overhead layouts and responsive typography.
* **Firebase (Auth & Firestore)** — Real-time persistence layer and encrypted token state management.
* **Recharts** — Responsive, clean data visualizations for sales velocity and daily analytics.
* **Lucide Icons** — Beautiful, lightweight geometric SVG vector graphics.

---

## 🛡️ License

RetailFlow OS is open-source software licensed under the **MIT License**.
