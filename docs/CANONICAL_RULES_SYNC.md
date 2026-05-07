# Canonical Governance Rules - Exit From Matrix

**Source:** Master workspace `EXIT_FROM_MATRIX_CANONICAL_RULES_V1.md`  
**Last Sync:** 2026-05-07  
**Scope:** UI/UX constraints, product requirements, governance enforcement

---

## Core Principle

**Exit from Matrix = Equality, Transparency, Collective Governance**

No hierarchies. No wealth-based privileges. Every person has equal power.

---

## Voting Rules

### Fundamental Principle
```
1 PERSON = 1 VOTE (always)
```

- **No token-weighted voting** — voting power cannot be purchased, staked, or transferred
- **No wealth-based voting** — monthly contribution level does not affect voting power
- **No reputation-weighted voting** — member tenure or karma does not increase vote weight
- **Universal participation** — only requirement: verified membership (1 account per person)

### Quorum Levels (Participation Thresholds)

| Decision Type | Quorum Required | Outcome |
|---------------|-----------------|---------|
| **Standard Votes** | 50% + 1 | Simple majority |
| **Important Changes** | 60% | Governance rules, contract changes |
| **Critical Decisions** | 70% | Platform shutdown, fund transfers >20% treasury |

### Voting Mechanics

- Open voting period: minimum 7 days
- Multiple choice+ yes/no/abstain options
- Real-time vote tallying (publish running counts)
- Abstention counted separately (not = yes or no)
- Vote changes allowed until deadline
- No vote selling, delegating, or proxy voting

---

## Economic Model

### Universal Basic Income
- **Monthly stipend:** €10 (baseline starting amount)
- **Paid from treasury** in real-time (weekly payouts)
- **Automatic for all active members** (no application)
- **No income cap** — wealth cap doesn't apply to UBI

### Profit Sharing
- **Treasury profit share:** 50% distributed to members proportionally
- **Participation-based:** share calculated per member's voting activity, contribution engagement
- **Transparent calculation:** auditable formula, published monthly
- **No token lock-up:** funds immediately available

### Treasury Transparency
- **All transactions public** — receipts, spending, income streams logged on-chain
- **Real-time balance public** — dashboard shows current EUR/stablecoin balance
- **Spending approval required** (see Budget Voting below)
- **No hidden reserves** — 100% of assets visible to members

### Budget Voting
- **Monthly budget cycle** — members vote on planned spending categories
- **Spending limits by category** enforced by smart contract
- **Emergency fund** (< 5% of treasury) accessible without vote for urgent needs
- **Audit trail** — all budget allocations traceable to vote

---

## Governance Rules

### Equality Enforced
- **No permanent roles** — leadership rotates (quarterly)
- **No veto power** — all decisions subject to vote
- **No board overrides** — direct democracy on all material decisions
- **No special access** — all members see same data, tools, treasury state

### Transparency Principles
- **Data auditability** — cryptographic commitment to all records
- **Open-source operations** — governance logic published and reviewable
- **Member access** — every member can export personal voting history, transactions
- **Public dispute log** — disagreements/conflicts published (privacy: names anonymized if requested)

### Anti-Corruption Safeguards
- **Conflict of interest disclosure** — members voting on issues affecting them state it publicly
- **Term limits** — any leadership/facilitation role: max 6 months consecutive, 12-month cooloff
- **Spending caps** — any individual can't receive >15% of monthly treasury (prevents capture)
- **Redundant approval** — spending >10% treasury requires 2 different governance votes

---

## Platform Features (Non-Negotiable)

### Forum (Discussion)
- Threaded discussions, no moderation except spam/abuse
- Voting power = post visibility (not censorship)
- Member profiles show participation history

### Voting Interface
- All active votes visible in dashboard
- Clear vote results (yes/no/abstain breakdown, participation %)
- Member can vote once per proposal, change vote anytime until deadline
- Results locked after deadline with signature

### System Monitor
- Real-time treasury balance
- Monthly budget breakdown
- Member stats (active voters, participation rate)
- Audit log (last 90 days of transactions)

### Member Dashboard
- Personal earnings summary (UBI + profit share)
- Voting history (all votes cast, with reasoning if provided)
- Account settings (payment method, communication preferences)
- Referral tracking (if applicable)

---

## UI/UX Copy & Messaging

**Must enforce in all user-facing text:**

| Principle | Example Text |
|-----------|--------------|
| **Equality** | "Every member has 1 vote. No exceptions." |
| **Transparency** | "See exactly how your money moves." |
| **Autonomy** | "You control your data, votes, and account." |
| **Participation** | "Your voice shapes what happens next." |

---

## Constraints for UI Implementation

### Do's ✅
- Show real-time voting progress (live count)
- Display quorum % required and current participation
- Make Treasury data immediately visible (no clicks to see balance)
- Show when your vote was cast/changed (personal voting receipt)
- Link spending decisions to member votes that approved them

### Don'ts ❌
- Do NOT show voting power as a number (implies variability)
- Do NOT hide treasury info behind permissions
- Do NOT use "admin" or "moderator" UI badges (reinforces hierarchy)
- Do NOT suggest that more contribution = more influence
- Do NOT allow voting delegation or proxies
- Do NOT implement "weighted voting" options (even as "advanced feature")

---

## Enforcement

This file is the **source of truth** for visual and product reviews.

- **Builder AI** uses this to guide UI decisions
- **Coding AI** verifies integration against these rules
- **PR review** flags any violations before merge
- **If conflict:** governance rules always win over UX convenience

---

## Versioning

- **v1.0** — 2026-05-07 — Initial rules from Exit Matrix platform research
- **Update process:** Any rule change requires member vote + commit to master repo

