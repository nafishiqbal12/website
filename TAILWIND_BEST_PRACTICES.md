# Tailwind CSS Class Organization & Best Practices Guide

## Overview
This guide provides a structured approach to organizing Tailwind CSS classes for maximum readability, maintainability, and consistency across the BlockWave Lab codebase.

---

## 1. CLASS ORDERING CONVENTION

### Recommended Order (Priority-Based)
Follow this order when writing Tailwind classes to create a predictable pattern:

```
1. Display & Position
2. Layout (Flex/Grid)
3. Sizing (Width/Height)
4. Spacing (Padding/Margin)
5. Border & Radius
6. Background & Colors
7. Text Properties
8. Effects & Filters
9. Transitions & Animation
10. Responsive & State Modifiers
```

### Example Implementation

**GOOD ✅**
```tsx
className="
  flex items-center justify-center
  w-full h-screen
  px-4 py-6
  rounded-lg
  bg-gradient-to-r from-[#0B0E14] to-[#0B0E14]/80
  text-white text-lg font-bold
  shadow-lg hover:shadow-xl
  transition-all duration-300
  md:flex-row lg:px-8
"
```

**BETTER (Single Line) ✅**
```tsx
className="flex items-center justify-center w-full h-screen px-4 py-6 rounded-lg bg-gradient-to-r from-[#0B0E14] to-[#0B0E14]/80 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 md:flex-row lg:px-8"
```

---

## 2. DETAILED CLASS CATEGORIES

### 2.1 Display & Position (First Priority)
Used for controlling layout rendering and positioning.

```tsx
// Display types
className="block | inline | inline-block | flex | grid | hidden"

// Position
className="relative | absolute | fixed | sticky"

// Z-index
className="z-0 | z-10 | z-50"
```

**Example:**
```tsx
<div className="sticky top-0 relative z-50 flex">...</div>
```

---

### 2.2 Layout (Flex/Grid)
Defines flexible and grid-based layouts.

```tsx
// Flex direction
className="flex-row | flex-col | flex-wrap"

// Flex alignment
className="items-center | justify-between | gap-4"

// Grid
className="grid grid-cols-1 md:grid-cols-3 gap-8"
```

**Example:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Content */}
</div>
```

---

### 2.3 Sizing
Controls element dimensions.

```tsx
// Width
className="w-full | w-1/2 | w-96"

// Height
className="h-screen | h-16 | h-auto"

// Min/Max
className="min-h-screen | max-w-7xl"
```

**Example:**
```tsx
<div className="w-full max-w-7xl h-auto min-h-screen">...</div>
```

---

### 2.4 Spacing
Padding and margin utilities.

```tsx
// Padding
className="p-4 | px-6 | py-8"

// Margin
className="m-4 | mx-auto | mb-6"

// Gap (for flex/grid)
className="gap-4 | gap-x-8 | gap-y-12"
```

**Example:**
```tsx
<div className="px-4 py-8 sm:px-6 lg:px-8 mx-auto">...</div>
```

---

### 2.5 Border & Radius
Border styling and corner rounding.

```tsx
// Border
className="border | border-t | border-white/20"

// Radius
className="rounded-lg | rounded-2xl | rounded-full"
```

**Example:**
```tsx
<div className="border border-white/5 rounded-lg">...</div>
```

---

### 2.6 Background & Colors
Color utilities for backgrounds, text, and borders.

```tsx
// Background
className="bg-white | bg-[#0B0E14] | bg-gradient-to-r from-blue-600 to-cyan-500"

// Text Color
className="text-white | text-gray-300 | text-cyan-400"

// Border Color
className="border-white/20"

// Fill/Stroke
className="fill-currentColor | stroke-white"
```

**Example:**
```tsx
<div className="bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-900 border-white/5">
  ...
</div>
```

---

### 2.7 Text Properties
Typography utilities.

```tsx
// Font size
className="text-sm | text-lg | text-6xl"

// Font weight
className="font-normal | font-bold | font-black"

// Line height
className="leading-tight | leading-relaxed"

// Text align
className="text-left | text-center | text-right"
```

**Example:**
```tsx
<h1 className="text-6xl lg:text-7xl font-black leading-tight">...</h1>
```

---

### 2.8 Effects & Filters
Shadows, opacity, and visual effects.

```tsx
// Shadow
className="shadow-sm | shadow-lg | shadow-2xl"

// Opacity
className="opacity-0 | opacity-50 | opacity-100"

// Blur
className="blur-md | backdrop-blur-xl"

// Mix blend
className="mix-blend-multiply"
```

**Example:**
```tsx
<div className="shadow-lg opacity-80 backdrop-blur-md">...</div>
```

---

### 2.9 Transitions & Animation
Smooth transitions and animations.

```tsx
// Transition
className="transition | transition-all | transition-colors"

// Duration
className="duration-300 | duration-500"

// Timing
className="ease-out | ease-in-out"

// Animation
className="animate-fade-in | animate-radial-glow"
```

**Example:**
```tsx
<div className="transition-all duration-300 hover:scale-105">...</div>
```

---

### 2.10 Responsive & State Modifiers (Last)
Responsive breakpoints and pseudo-class modifiers.

```tsx
// Responsive
className="md:flex-row lg:px-8 xl:gap-12"

// States
className="hover:text-cyan-400 focus:outline-none active:scale-95"

// Dark mode
className="dark:bg-gray-900"

// Disabled
className="disabled:opacity-50"
```

**Example:**
```tsx
className="text-gray-700 hover:text-blue-600 md:text-lg lg:px-8 transition-colors"
```

---

## 3. REAL-WORLD EXAMPLES FROM BLOCKWAVE LAB

### Example 1: Navigation Button
```tsx
// Component: Navigation Get Started Button
className="
  relative px-6 py-2 rounded-lg font-medium overflow-hidden group
  bg-white/10 backdrop-blur rounded-lg border border-white/20
  hover:border-white/40 hover:bg-white/15
  transition-all
"
```

### Example 2: Hero Section Heading
```tsx
// Component: Hero H1
className="
  text-6xl lg:text-7xl font-black mb-6 leading-tight
  fade-in-up
"
```

### Example 3: Service Card
```tsx
// Component: Service Card
className="
  bg-gradient-to-br from-blue-50 to-cyan-50
  rounded-2xl p-8
  hover:shadow-xl hover:-translate-y-2
  transition-all group
"
```

### Example 4: Partner Logo Item
```tsx
// Component: Partner Logo
className="
  text-gray-400 font-bold text-xl
  transition-all duration-300 ease-out
  cursor-pointer transform hover:scale-105
"
```

### Example 5: Footer Social Link
```tsx
// Component: Social Media Link
className="
  w-10 h-10
  bg-gray-800 rounded-lg
  flex items-center justify-center
  hover:bg-cyan-500
  transition-colors
"
```

---

## 4. BEST PRACTICES

### ✅ DO's

**1. Use Consistent Spacing Scale**
```tsx
// Good
className="p-4 m-8 gap-6"

// Avoid
className="p-3 m-7 gap-5"
```

**2. Group Related Classes Together**
```tsx
// Good - Layout related classes grouped
className="flex items-center justify-between w-full px-4 py-6 gap-4"

// Avoid - Classes scattered randomly
className="px-4 flex gap-4 justify-between w-full py-6 items-center"
```

**3. Use Consistent Color Palette**
```tsx
// Good - Using defined colors
className="bg-[#0B0E14] text-cyan-400 border-white/20"

// Avoid - Random colors
className="bg-black text-[#00D9FF] border-gray-500"
```

**4. Leverage Responsive Prefixes**
```tsx
// Good - Clear mobile-first approach
className="flex-col md:flex-row text-sm lg:text-base"

// Avoid - Unclear responsive behavior
className="md:text-base text-sm flex-col md:flex-row"
```

**5. Use Custom Classes for Complex Patterns**
```tsx
// In index.css
@layer components {
  .glass-effect {
    @apply bg-white/10 backdrop-blur-md rounded-lg border border-white/20;
  }
}

// In component
className="glass-effect hover:border-white/40 transition-all"
```

### ❌ DON'Ts

**1. Avoid Mixing Different Class Ordering Patterns**
```tsx
// Bad - Inconsistent
className="text-white px-4 flex gap-4 py-6"

// Good - Consistent
className="flex gap-4 px-4 py-6 text-white"
```

**2. Avoid Using Arbitrary Colors**
```tsx
// Avoid
className="text-[#FF6B9D] bg-[#ABC123]"

// Prefer
className="text-pink-500 bg-green-600"
// Or extend tailwind.config.js
```

**3. Avoid Deeply Nested Selectors (when possible)**
```tsx
// Avoid when possible
className="group hover:bg-blue-600 group-hover:shadow-lg"

// Consider using ::before/::after pseudo-elements
```

**4. Avoid Hardcoded Dimensions Without Responsive**
```tsx
// Avoid
className="w-80 h-40"

// Better
className="w-full md:w-80 h-auto md:h-40"
```

---

## 5. PERFORMANCE TIPS

### 1. Tree-shake Unused Classes
```
// In tailwind.config.js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

### 2. Use CSS Variables for Dynamic Values
```tsx
// Instead of multiple similar classes
style={{ backgroundColor: dynamicColor }}

// Or extend theme
<div style={{ '--my-color': color } as any} className="bg-[var(--my-color)]">
```

### 3. Avoid Inline Styles When Possible
```tsx
// Prefer Tailwind
className="w-full h-auto"

// Over inline styles
style={{ width: '100%', height: 'auto' }}
```

---

## 6. CONFIGURATION RECOMMENDATIONS

### Tailwind Config Extensions
```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'web3-dark': '#0B0E14',
        'web3-purple': '#A020F0',
        'web3-cyan': '#00D9FF',
      },
      spacing: {
        // Custom spacing if needed
      },
      fontSize: {
        // Custom font sizes
      },
      animation: {
        'radial-glow': 'radialGlow 4s ease-in-out infinite',
      },
    },
  },
}
```

---

## 7. ACCESSIBILITY WITH TAILWIND

### Important Classes for Accessibility

```tsx
// Skip links
className="sr-only focus:not-sr-only"

// Focus states
className="focus:outline-none focus:ring-2 focus:ring-cyan-400"

// Disabled states
className="disabled:opacity-50 disabled:cursor-not-allowed"

// Visible labels
className="font-bold text-base" // Ensure readable text

// Sufficient contrast
className="bg-[#0B0E14] text-white" // High contrast
```

### Example: Accessible Button
```tsx
<button
  className="
    px-4 py-2
    bg-blue-600 text-white
    rounded-lg font-semibold
    hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-400
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-colors duration-200
  "
  disabled={isLoading}
  aria-label="Submit form"
>
  Submit
</button>
```

---

## Conclusion

Following these guidelines ensures:
✅ Consistent code style
✅ Improved readability and maintainability
✅ Better performance
✅ Improved accessibility
✅ Easier collaboration among developers
