# Document Variants

All three docs must be grounded in the real implementation, target end users, use consistent terminology, and avoid internal details or unimplemented behavior.

If the feature is small, compress the structure instead of padding sections.

## 1. Full Help-Center Version

Goal: help center, knowledge base, or usage guide.

Suggested structure:

```md
# Title

## What It Does

## When to Use It

## How to Use It

## Main Actions

## Shortcuts or Advanced Actions

## FAQ

## Notes
```

Writing rules:

- explain clearly what the feature is
- cover entry points, buttons, and user steps
- call out shortcuts, bulk actions, import/export, or advanced flows when real
- include common misunderstandings, constraints, or edge cases in FAQ or Notes

## 2. Official Site / Product Copy

Goal: site copy, product page, feature page, or launch copy.

Suggested structure:

```md
# Title

## Overview

## Core Capabilities

## Use Cases

## Value
```

Writing rules:

- emphasize user value and practical benefits
- keep the tone polished and complete
- allow light product positioning
- avoid fluffy marketing language

## 3. In-Product Short Version

Goal: modal help, side help, inline hint card, or embedded guidance.

Suggested structure:

```md
# Title

One-sentence summary

## Quick Start

## Tips
```

Writing rules:

- keep it readable within one screen when possible
- prioritize the most important entry points, buttons, and shortcuts
- use short sentences
- stay action-oriented

## Minimum Quality Check

Before writing to disk, verify at least:

- title matches the real feature
- feature points come from implementation evidence
- button labels and entry names are real
- the three docs have clearly different styles and lengths
- important constraints and user-facing caveats are not missing
