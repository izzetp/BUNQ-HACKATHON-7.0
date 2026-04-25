# bunq Purchase Advisor

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Anthropic](https://img.shields.io/badge/Anthropic-Claude-FF7819)](https://anthropic.com)
[![bunq Hackathon 7.0](https://img.shields.io/badge/bunq-Hackathon%207.0-00B4E6)](https://bunq.com)

An AI purchase decision assistant that helps users decide whether to buy, wait, or choose a better option — before money leaves their account.

**Live demo:** https://bunq-hackathon-7-0-phi.vercel.app/

Validated with the official bunq sandbox toolkit (authentication + transaction endpoint access).

---

## Problem

People make purchase decisions every day without enough financial context. They overspend, miss cheaper vendors, or overlook better alternatives. Banking apps typically show you spending after it happens — not before.

## Solution

The app answers: **Should I buy this?**

- Scan a product image, paste a URL, or enter details manually
- The app compares vendor prices, alternatives, and simulated bunq spending context
- Returns one clear decision: **BUY**, **WAIT**, or **CHOOSE_ALTERNATIVE**

## What's Novel

- Pre-purchase financial decisioning — intervenes before money leaves the account
- Deterministic recommendation engine for trust and explainability (AI never decides the verdict)
- Vendor comparison with ecosystem-aware alternative matching
- Multimodal product understanding: photograph a product or price tag to begin

## Demo Flow

1. Scan a product image, paste a product URL, or type manually
2. AI extracts product name and price from image or URL
3. Receive a BUY / WAIT / CHOOSE_ALTERNATIVE verdict with plain-language reasoning
4. Compare vendor prices and see alternatives within or across product ecosystems

## How it works

1. Input product by image, URL, or manual entry
2. AI extracts product details from image or URL
3. Deterministic analyzer compares vendor prices, alternatives, budget, and spending context
4. App returns a clear financial recommendation

## AI usage

- **Image scan:** Claude Sonnet 4.6 (vision) extracts product name and price from photos
- **URL extraction:** three-tier pipeline — JSON-LD structured data first, Open Graph meta second, Claude Haiku only as fallback when structured markup is absent
- **Explanation:** Claude Haiku generates a short, specific rationale for the recommendation
- Final verdict logic is fully deterministic — AI handles understanding and explanation only

## Multimodal aspect

Image scanning is the non-text modality. Users can photograph a product or price tag instead of typing. Claude Sonnet 4.6 identifies the product, extracts a price if visible, and pre-fills the form — making the experience faster and more natural.

## Key features

- Image-based product scan (Claude Sonnet 4.6 vision)
- URL and manual product input
- Mock vendor price comparison (Dutch retailers)
- Ecosystem-aware alternative recommendations
- Clear BUY / WAIT / CHOOSE_ALTERNATIVE decision

## bunq integration

This prototype is designed as a pre-purchase feature inside a bunq-style banking experience. Connectivity was validated using the official bunq Hackathon 7.0 sandbox toolkit, including authentication and transaction endpoint access. The simulated spending context mirrors what live bunq transaction data would provide. In a production version, mock context is replaced by real bunq transaction data to personalize recommendations based on actual budget usage, category spend, and savings goals.

## Tech stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Anthropic SDK (`@anthropic-ai/sdk`)

## Setup

```bash
npm install
cp .env.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment variables

```
ANTHROPIC_API_KEY=your_key_here
```

## Demo notes

- Vendor prices are mocked (Dutch retailer data)
- bunq spending context is simulated
- Product matching covers 16 products with strict alias-based lookup
- The goal is to demonstrate the decision flow and user value, not live data integrations

## Why it matters

Most financial tools help you understand money you've already spent. This app intervenes at the moment of decision — before the purchase — and gives you context a bank uniquely has: your budget, your category spend, your savings goal. That's the insight bunq is positioned to provide.
