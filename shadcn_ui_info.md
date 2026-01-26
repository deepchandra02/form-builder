# Shadcn UI Components Registry Overview

## Summary
This document provides a comprehensive list of all 439 components, blocks, examples, and utilities available in the @shadcn registry for your project.

## Registry Configuration
Your project has the **@shadcn** registry configured.

---

## Available Components by Category

### UI Components (Core) - 57 items
Essential UI building blocks that can be added to your project:

- **accordion** - Collapsible content sections
- **alert** - Alert messages and notifications
- **alert-dialog** - Modal dialog for important alerts
- **aspect-ratio** - Maintain aspect ratio of content
- **avatar** - User avatar component
- **badge** - Small status indicators
- **breadcrumb** - Navigation breadcrumb trail
- **button** - Interactive button component
- **button-group** - Grouped buttons
- **calendar** - Date picker calendar
- **card** - Content card container
- **carousel** - Image/content carousel slider
- **chart** - Chart visualization component
- **checkbox** - Checkbox input
- **collapsible** - Collapsible content sections
- **combobox** - Searchable select dropdown
- **command** - Command palette/menu
- **context-menu** - Right-click context menu
- **dialog** - Modal dialog
- **drawer** - Slide-out drawer panel
- **dropdown-menu** - Dropdown menu
- **empty** - Empty state placeholder
- **field** - Form field wrapper
- **form** - Form management
- **hover-card** - Hover card popover
- **input** - Text input field
- **input-group** - Grouped input components
- **input-otp** - One-time password input
- **item** - List item component
- **kbd** - Keyboard shortcut display
- **label** - Form label
- **menubar** - Application menu bar
- **navigation-menu** - Navigation menu
- **native-select** - Native select element
- **pagination** - Pagination controls
- **popover** - Popover overlay
- **progress** - Progress indicator
- **radio-group** - Radio button group
- **resizable** - Resizable panels
- **scroll-area** - Custom scrollable area
- **select** - Custom select dropdown
- **separator** - Visual separator line
- **sheet** - Slide-out sheet panel
- **sidebar** - Application sidebar
- **skeleton** - Loading skeleton placeholder
- **slider** - Range slider input
- **sonner** - Toast notifications (Sonner library)
- **spinner** - Loading spinner
- **switch** - Toggle switch
- **table** - Data table
- **tabs** - Tabbed interface
- **textarea** - Multi-line text input
- **toggle** - Toggle button
- **toggle-group** - Group of toggle buttons
- **tooltip** - Tooltip overlay

### Blocks - 90+ items
Pre-built larger component compositions:

#### Sidebar Blocks (16 variants)
- **sidebar-01** through **sidebar-16** - Various sidebar layouts including:
  - Simple navigation
  - Collapsible sections
  - Submenus and dropdowns
  - Icon-only collapsed state
  - Calendar integration
  - Dialog/popover variants
  - Left/right positioning
  - Sticky headers

#### Dashboard Blocks
- **dashboard-01** - Complete dashboard with sidebar, charts, and data table

#### Authentication Blocks (15 items)
- **login-01** through **login-05** - Login page variants
- **signup-01** through **signup-05** - Signup page variants
- **otp-01** through **otp-05** - OTP verification pages

#### Calendar Blocks (32 variants)
- **calendar-01** through **calendar-32** - Comprehensive calendar implementations:
  - Single/multiple month views
  - Single/multiple/range selection
  - Date pickers with time
  - Disabled dates and weekends
  - Localized calendars
  - Month/year dropdowns
  - Booked/unavailable days
  - Week numbers
  - Presets and custom formatters
  - Natural language input
  - Drawer integration

#### Chart Blocks (60+ variants)
Extensive chart examples using Recharts:

**Area Charts** (10 variants)
- Default, gradient, stacked, interactive, with legends, axes, icons, etc.

**Bar Charts** (10 variants)
- Horizontal, stacked, labeled, mixed, negative values, etc.

**Line Charts** (10 variants)
- With dots, custom labels, multiple lines, step charts, etc.

**Pie Charts** (11 variants)
- Simple, donut, interactive, labeled, with legends, stacked, etc.

**Radar Charts** (13 variants)
- Grid variations, filled, with dots, multiple datasets, custom styling, etc.

**Radial Charts** (6 variants)
- Simple, stacked, with labels, custom shapes, text overlays, etc.

**Tooltip Charts** (9 variants)
- Custom tooltips, indicators, formatters, advanced configurations, etc.

### Examples - 220+ items
Working code examples demonstrating component usage:

- Component demos for all UI components (e.g., accordion-demo, button-demo)
- Variant examples (e.g., button-secondary, button-destructive, button-ghost)
- Usage patterns (e.g., button-with-icon, button-loading, button-as-child)
- Form examples with React Hook Form and TanStack Form
- Input group combinations
- Field component patterns
- Typography examples
- Data table implementations
- Date picker variants
- Drawer/dialog combinations
- And many more...

### Utilities & Hooks
- **utils** (registry:lib) - Utility functions
- **use-mobile** (registry:hook) - Mobile detection hook

### Themes
5 color theme variants:
- **theme-stone**
- **theme-zinc**
- **theme-neutral**
- **theme-gray**
- **theme-slate**

### Styles
- **index** (registry:style)
- **style** (registry:style)

---

## How to Use Components

### View Component Details
To see the implementation details of any component:
```bash
npx shadcn@latest view @shadcn/button
```

### Add Components to Your Project
To add a component:
```bash
npx shadcn@latest add @shadcn/button
```

To add multiple components:
```bash
npx shadcn@latest add @shadcn/button @shadcn/card @shadcn/input
```

### Search for Components
You can search for specific components by name or description to find what you need.

### View Examples
Most components have multiple examples showing different use cases. Examples follow the pattern `{component-name}-demo` or `{component-name}-{variant}`.

---

## Component Categories Summary

| Category | Count | Description |
|----------|-------|-------------|
| UI Components | 57 | Core reusable UI elements |
| Blocks | 90+ | Pre-built larger compositions |
| Examples | 220+ | Working implementation examples |
| Chart Blocks | 60+ | Recharts-based visualizations |
| Calendar Blocks | 32 | Date/time picker implementations |
| Auth Blocks | 15 | Login/signup/OTP pages |
| Sidebar Blocks | 16 | Navigation sidebar layouts |
| Utilities | 2 | Helper functions and hooks |
| Themes | 5 | Color theme variations |

**Total Items**: 439

---

## Next Steps

This is a reference document showing what's available in the @shadcn registry. To add components to your project:

1. Browse the categories above to find components that fit your needs
2. Use the CLI commands to view or add components
3. Check the examples for implementation guidance
4. Refer to the official shadcn/ui documentation for detailed usage

Let me know if you'd like to explore any specific components or categories in more detail.
