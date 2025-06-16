# UI / Brand Style Guide

## 1. Brand Colors (for tailwind.config.js)
The agent will use these hex codes to configure the Tailwind theme.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#475569', // slate-600
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f97316', // orange-500
        },
      },
    },
  },
};
```

## 2. Typography
Define font usage and corresponding Tailwind utility classes.

| Element | Class | Font Family |
|---|---|---|
| h1 | `text-4xl font-extrabold tracking-tight` | Inter, sans-serif |
| h2 | `text-3xl font-semibold` | Inter, sans-serif |
| Body | `text-base font-normal` | Inter, sans-serif |

## 3. UI Components (based on shadcn/ui)
- **Button:** Use the `shadcn/ui` Button component. Variants: `default`, `destructive`, `outline`, `ghost`.
- **Card:** Use the `Card`, `CardHeader`, `CardContent`, and `CardFooter` components for all boxed content.
- **Input:** Use the `Input` component for all form fields.

## 4. Accessibility Checklist
- All color combinations must have a contrast ratio of at least 4.5:1 (WCAG AA).
- All interactive elements must have a clear `:focus-visible` state.
- All images must have descriptive `alt` tags.
- The application must be fully navigable using only the keyboard.

## 5. Spacing / Radius / Shadow tokens
Consider adding a simple Spacing / Radius / Shadow tokens table (e.g. --space-4, --radius-lg) so the agent has constants instead of hard-coded px.