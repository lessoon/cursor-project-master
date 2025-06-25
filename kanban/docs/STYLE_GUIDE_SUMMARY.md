# CPM Kanban Style Guide Summary

## 🎨 Brand Colors & Design System

### Primary Colors (Current Implementation)
```css
/* Primary AI Color - Used for all main actions */
--primary: #5B8EFF;
--primary-hover: #5B8EFF/80;

/* Success/Completion */
--success: #4ADE80;

/* Warning/Pending */
--warning: #F59E0B;

/* Background */
--bg-primary: #0B0E14;
--bg-gradient: linear-gradient(to-br, #10141C, #0B0E14);
```

### Secondary Colors
```css
/* Text Colors */
--text-primary: #FFFFFF;
--text-secondary: rgba(255, 255, 255, 0.8);
--text-muted: rgba(255, 255, 255, 0.6);

/* Border & Dividers */
--border: rgba(255, 255, 255, 0.1);
--border-hover: rgba(255, 255, 255, 0.2);
```

## 📝 Typography System

| Element | Classes | Usage |
|---------|---------|-------|
| **Page Title** | `text-2xl font-bold text-white` | Main page headings |
| **Modal Title** | `text-xl font-semibold text-white` | Modal and card titles |
| **Section Header** | `text-lg font-semibold text-white` | Section dividers |
| **Body Text** | `text-sm text-white/80` | Regular content |
| **Muted Text** | `text-xs text-white/60` | Descriptions, metadata |
| **Labels** | `text-xs font-medium` | Tags and badges |

## 🧩 Component Standards

### Buttons
```tsx
// Primary Action
<Button className="bg-[#5B8EFF] hover:bg-[#5B8EFF]/80 text-white">

// Success Action  
<Button className="bg-[#4ADE80] hover:bg-[#4ADE80]/80 text-white">

// Ghost Button
<Button variant="ghost" className="hover:bg-white/10 text-white/80">
```

### Cards & Containers
```tsx
// Modal Background
className="bg-[#0B0E14]/95 backdrop-blur-[24px] border border-white/10 rounded-[18px]"

// Card Background
className="bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"

// Icon Container
className="w-8 h-8 bg-[#5B8EFF]/20 rounded-lg flex items-center justify-center"
```

### Interactive States
```css
/* Hover States */
.hover-primary { @apply hover:bg-[#5B8EFF]/10 hover:text-[#5B8EFF]; }
.hover-ghost { @apply hover:bg-white/10 hover:text-white; }

/* Focus States */
.focus-ring { @apply focus:border-white/20 focus:ring-2 focus:ring-[#5B8EFF]/20; }
```

## 🎯 Icon & Visual System

### Status Icons
- **AI Working**: Sparkles with `text-[#5B8EFF]`
- **Success**: CheckCircle2 with `text-[#4ADE80]`
- **Warning**: AlertCircle with `text-[#F59E0B]`
- **Error**: X with `text-red-400`

### Resource Type Icons
- **Documents**: FileText with blue accent
- **Code**: FileCode with blue accent  
- **Config**: Cog with purple accent
- **Guide**: Book with green accent

## 📐 Spacing & Layout

### Standard Spacing
```css
--space-xs: 0.25rem;  /* 4px */
--space-sm: 0.5rem;   /* 8px */
--space-md: 1rem;     /* 16px */
--space-lg: 1.5rem;   /* 24px */
--space-xl: 2rem;     /* 32px */
```

### Border Radius
```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1.125rem;  /* 18px */
```

## ♿ Accessibility Guidelines

### Color Contrast
- **Text on dark background**: Use `text-white` or `text-white/80`
- **Interactive elements**: Minimum 4.5:1 contrast ratio
- **Focus indicators**: Always visible with `focus:ring-2`

### Keyboard Navigation
- **Tab order**: Logical flow through interactive elements
- **Focus management**: Clear focus indicators on all interactive elements
- **Escape key**: Closes modals and overlays

### Screen Readers
- **Alt text**: All images and icons have descriptive labels
- **ARIA labels**: Interactive elements have proper ARIA attributes
- **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)

## 🎬 Animation Standards

### Transition Timing
```css
/* Standard transitions */
.transition-standard { @apply transition-all duration-150 ease-out; }

/* Hover effects */
.transition-hover { @apply transition-colors duration-150; }

/* Modal animations */
.modal-enter { @apply transition-all duration-150 ease-out; }
```

### Animation Effects
- **Modal entrance**: Scale from 95% to 100% with fade-in
- **Card hover**: Subtle background color transition
- **Button press**: Brief scale effect (98%)
- **Loading states**: Smooth spinner rotation

## 🏷️ Component Patterns

### Modal Structure
```tsx
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
  <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  w-[90vw] max-w-lg bg-[#0B0E14]/95 backdrop-blur-[24px]
                  border border-white/10 rounded-[18px] z-50">
    {/* Header with icon, title, and close button */}
    {/* Content area with proper spacing */}
    {/* Footer with action buttons */}
  </div>
</div>
```

### Form Elements
```tsx
<Input className="bg-white/5 border-white/10 text-white placeholder:text-white/40 
                  focus:border-white/20" />

<Textarea className="bg-white/5 border-white/10 text-white placeholder:text-white/40 
                     resize-none focus:border-white/20" />
```

### Badge & Label System
```tsx
// Type badges
<Badge className="bg-blue-500/20 text-blue-300">feature</Badge>
<Badge className="bg-green-500/20 text-green-300">enhancement</Badge>
<Badge className="bg-red-500/20 text-red-300">bugfix</Badge>

// Status indicators
<Badge className="bg-[#5B8EFF] text-white">Active</Badge>
<Badge className="bg-[#4ADE80] text-white">Complete</Badge>
```

## 🎨 Dark Theme Compliance

All components are designed for dark theme by default:
- **Background gradients**: Dark blue to black
- **Text hierarchy**: White with opacity variations
- **Borders**: Subtle white with low opacity
- **Hover states**: Lighten backgrounds, not darken
- **Focus indicators**: Bright accent colors for visibility

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Mobile Adaptations
- **Modal width**: `w-[90vw]` for mobile, `max-w-lg` for desktop
- **Button sizing**: Larger touch targets on mobile
- **Text scaling**: Responsive font sizes where appropriate
- **Navigation**: Collapsible elements for smaller screens

## 🔧 Implementation Notes

### CSS Custom Properties
Consider implementing CSS custom properties for easier theme management:
```css
:root {
  --color-primary: #5B8EFF;
  --color-success: #4ADE80;
  --color-warning: #F59E0B;
  --bg-primary: #0B0E14;
  --text-primary: #FFFFFF;
  --border-primary: rgba(255, 255, 255, 0.1);
}
```

### Component Consistency
- Always use the established color palette
- Follow the spacing system consistently
- Use standard transition timings
- Maintain proper contrast ratios
- Test with keyboard navigation

---

*This style guide reflects the current implementation of the CPM Kanban Board and should be referenced for all future development to maintain design consistency.* 