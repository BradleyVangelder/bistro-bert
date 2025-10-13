# Smart Text Truncation Guide

This guide explains how to implement smart text truncation that only applies to text with 4-5+ words, preserving shorter text as-is.

## Problem We're Solving

Regular text truncation (`text-ellipsis`, `overflow-hidden`) cuts off text regardless of length. This means even short text like "Menu" or "Home" gets truncated unnecessarily.

## Our Solution

Smart truncation that:
- **Preserves short text** (1-3 words) completely
- **Only truncates longer text** (4+ words) when it actually overflows
- **Provides multiple truncation levels** based on content needs

## Components Available

### 1. SmartText Component
```tsx
import SmartText from '@/components/ui/SmartText'

<SmartText
  text="Short text"
  maxWords={4}
  maxLines={2}
  className="text-sm font-luxury"
/>
```

**Props:**
- `text`: The text to display
- `maxWords`: Word count threshold (default: 4)
- `maxLines`: Maximum lines to show when truncating (default: 2)
- `className`: Additional CSS classes
- `showTooltip`: Show full text on hover when truncated

### 2. useSmartTruncate Hook
```tsx
import { useSmartTruncate } from '@/hooks/useSmartTruncate'

function MyComponent({ title }) {
  const { getTextProps, isTruncated, shouldConsiderTruncation } = useSmartTruncate(title, {
    maxWords: 4,
    maxLines: 2
  })

  return (
    <h3 {...getTextProps()} className="font-semibold">
      {title}
      {isTruncated && <span className="text-gray-400">...</span>}
    </h3>
  )
}
```

**Hook Returns:**
- `getTextProps()`: Props to apply to text element
- `isTruncated`: Boolean if text is currently truncated
- `shouldConsiderTruncation`: Boolean if text exceeds word threshold
- `toggleTruncation()`: Function to show/hide full text
- `wordCount`: Number of words in text

### 3. Specialized Components

#### SmartNavigationItem
```tsx
import { SmartNavigationItem } from '@/components/ui/SmartText'

<SmartNavigationItem
  text="Menukaart"
  href="/menu"
  isActive={true}
/>
```

#### SmartMenuItem
```tsx
import { SmartMenuItem } from '@/components/ui/SmartText'

<SmartMenuItem
  title="Very Long Menu Item Title That Should Be Truncated"
  description="This is a long description that might need truncation if it exceeds the word limit"
/>
```

## CSS Classes Available

### Truncation Classes
```css
.smart-truncate-short    /* Single line with ellipsis */
.smart-truncate-medium   /* 2 lines */
.smart-truncate-long     /* 3 lines */
.smart-truncate-3        /* 3 lines */
.smart-truncate-4        /* 4 lines */
```

### Conditional Classes
```css
.nav-truncate           /* Navigation items */
.nav-truncate-long      /* Long navigation text */
.menu-item-truncate     /* Menu items */
.menu-item-truncate-long /* Long menu items */
```

## Usage Examples

### Example 1: Navigation Items
```tsx
// Don't truncate short navigation items
<SmartNavigationItem text="Menu" href="/menu" />  // 1 word - no truncation
<SmartNavigationItem text="Over ons" href="/about" />  // 2 words - no truncation

// Only truncate long navigation items
<SmartNavigationItem text="Reserveringen en contact" href="/contact" />  // 3 words - no truncation
<SmartNavigationItem text="Dit is een hele lange navigatie tekst" href="/long" />  // 6+ words - truncate if needed
```

### Example 2: Menu Items
```tsx
<SmartMenuItem
  title="Short"  // 1 word - no truncation
  description="Brief desc"  // 2 words - no truncation
/>

<SmartMenuItem
  title="This is a very long menu item title"  // 6+ words - truncate if needed
  description="This description has many words and should be truncated only when it overflows the container"  // 10+ words - truncate if needed
/>
```

### Example 3: Card Titles
```tsx
function ProductCard({ title, description }) {
  return (
    <div className="card">
      <SmartText
        text={title}
        maxWords={3}
        maxLines={1}
        className="font-bold text-lg"
      />
      <SmartText
        text={description}
        maxWords={8}
        maxLines={3}
        className="text-gray-600 mt-2"
      />
    </div>
  )
}
```

## How It Works

1. **Word Count Check**: First counts words in the text
2. **Threshold Comparison**: Compares against `maxWords` threshold
3. **Overflow Detection**: Checks if text actually overflows its container
4. **Conditional Truncation**: Only applies truncation if both conditions are met

### Word Count Logic
- 1-3 words: No truncation consideration
- 4+ words: Consider truncation if overflow detected
- 8+ words: More aggressive truncation

### Overflow Detection
The system detects actual CSS overflow, not just word count. This means:
- Long text in wide containers: No truncation
- Short text in narrow containers: No truncation
- Long text in narrow containers: Smart truncation applied

## Best Practices

1. **Set appropriate thresholds**:
   - Navigation: 3-4 words
   - Menu items: 4-5 words
   - Descriptions: 8-10 words
   - Body text: 10+ words

2. **Use tooltips for truncated content**:
   ```tsx
   <SmartText text={longText} showTooltip={true} />
   ```

3. **Consider responsive behavior**:
   - Mobile: Lower word thresholds
   - Desktop: Higher word thresholds

4. **Test with real content**: Use actual menu items and navigation text to set appropriate thresholds

## Migration Guide

### Before (Regular Truncation)
```tsx
<span className="truncate">{menuItem.title}</span>
```

### After (Smart Truncation)
```tsx
<SmartText
  text={menuItem.title}
  maxWords={4}
  maxLines={2}
  className="truncate"
/>
```

Or with the hook:
```tsx
const { getTextProps } = useSmartTruncate(menuItem.title, { maxWords: 4 })
<span {...getTextProps()} className="truncate">{menuItem.title}</span>
```

## Testing

Test with various text lengths:
1. Very short: "A" → No truncation
2. Short: "Menu" → No truncation
3. Medium: "Menu Item Two" → No truncation
4. Long: "This is a long menu item" → Truncate if overflow
5. Very long: "This is a very long menu item that extends" → Truncate aggressively

Test in different container sizes to ensure overflow detection works correctly.