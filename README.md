# First Baptist Church Fenton Design System

A comprehensive design system for First Baptist Church Fenton's website, featuring warm and welcoming colors with clean, modern typography perfect for a church community.

## 🎨 Design Philosophy

This design system embodies the welcoming spirit of First Baptist Church Fenton through:

- **Warm Color Palette**: Orange Peel and Copper Rust colors create a welcoming, community-focused atmosphere
- **Classic Typography**: Cardo (headings) and Proza Libre (body) combine tradition with modern readability
- **Accessible Design**: WCAG AA compliant colors and responsive typography
- **Consistent Experience**: Unified components and patterns across all digital touchpoints

## 📁 Project Structure

```
firstbaptistchurchfenton/
├── design-system/
│   ├── tokens/
│   │   └── design-tokens.json          # Complete design token definitions
│   └── css/
│       ├── variables.css               # CSS custom properties
│       └── components.css              # Component library
├── demo/
│   └── component-showcase.html         # Interactive component demo
├── IMPLEMENTATION_PLAN.md              # Detailed implementation roadmap
└── README.md                          # This file
```

## 🎯 Key Features

### Typography System
- **Heading Font**: Cardo (serif) - Elegant and authoritative
- **Body Font**: Proza Libre (sans-serif) - Clean and readable
- **Responsive Scale**: Optimized sizes for desktop and mobile
- **Complete Hierarchy**: H1-H6 plus body text variations

### Color System
- **Orange Peel Palette**: Primary brand colors (#FF9A00 base)
- **Copper Rust Palette**: Secondary accent colors (#924D4D base)
- **Neutral Palette**: Comprehensive grayscale (#FFFFFF to #070404)
- **4 Color Schemes**: Pre-defined combinations for different content areas

### Component Library
- **Buttons**: Primary, secondary, ghost, and icon variants
- **Forms**: Complete form elements with validation states
- **Cards**: Standard and elevated variants
- **Navigation**: Tabs, filters, and interactive elements
- **Utility Classes**: Spacing, shadows, and layout helpers

## 🚀 Quick Start

### 1. Include Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&family=Proza+Libre:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 2. Include Design System CSS
```html
<link rel="stylesheet" href="design-system/css/variables.css">
<link rel="stylesheet" href="design-system/css/components.css">
```

### 3. Start Using Components
```html
<button class="btn btn-primary">Join Our Community</button>
<div class="card">
  <h3 class="card-title">Sunday Service</h3>
  <p>Join us for worship and fellowship</p>
</div>
```

## 🎨 Color Usage

### Primary Colors
- **Orange Peel Base** (#FF9A00): Primary actions, CTAs, brand elements
- **Copper Rust Base** (#924D4D): Secondary accents, special sections
- **Neutral Darkest** (#070404): Primary text, high contrast elements

### Color Schemes
1. **Scheme 1**: Main content areas (white background)
2. **Scheme 2**: Featured sections (orange accent background)
3. **Scheme 3**: Secondary content (light neutral background)
4. **Scheme 4**: Special sections (copper rust accent background)

## 📱 Responsive Design

The design system uses a mobile-first approach with these breakpoints:
- **Mobile**: 480px and below
- **Tablet**: 481px - 768px
- **Desktop**: 769px - 1024px
- **Wide**: 1025px and above

## 🧩 Component Examples

### Buttons
```html
<!-- Primary Button -->
<button class="btn btn-primary">Visit Us</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Learn More</button>

<!-- Button with Icon -->
<button class="btn btn-primary">
  <span class="material-symbols-outlined">church</span>
  Service Times
</button>
```

### Cards
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Bible Study</h3>
    <p class="card-subtitle">Wednesdays at 7:00 PM</p>
  </div>
  <div class="card-content">
    <p>Join us for weekly Bible study sessions.</p>
  </div>
  <div class="card-actions">
    <button class="btn btn-primary">Join Study</button>
  </div>
</div>
```

### Forms
```html
<div class="form-group">
  <label class="form-label">Full Name</label>
  <input type="text" class="input" placeholder="Enter your name">
  <div class="form-help">Required for church directory</div>
</div>
```

## 🎯 Implementation Plan

Follow the detailed [Implementation Plan](IMPLEMENTATION_PLAN.md) for a systematic 7-week rollout:

1. **Week 1**: Foundation setup (typography, colors, base styles)
2. **Week 2-3**: Component library development
3. **Week 3-4**: Layout system and responsive design
4. **Week 4-5**: Church-specific components
5. **Week 5-6**: Content migration
6. **Week 6-7**: Testing and optimization
7. **Week 7-8**: Launch and post-launch support

## 🔧 Development Guidelines

### CSS Architecture
- Use CSS custom properties for consistent theming
- Follow BEM naming methodology for components
- Maintain semantic HTML structure
- Ensure keyboard accessibility

### Performance
- Optimize font loading with `font-display: swap`
- Use efficient CSS selectors
- Minimize bundle sizes
- Optimize images for web

### Accessibility
- Maintain WCAG AA color contrast ratios
- Include proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

## 📊 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+
- iOS Safari 14+
- Android Chrome 88+

## 🎉 Demo

View the interactive component showcase at `demo/component-showcase.html` to see all components in action.

## 📚 Resources

- [Design Tokens JSON](design-system/tokens/design-tokens.json) - Complete token definitions
- [CSS Variables](design-system/css/variables.css) - Implementation-ready CSS
- [Component Library](design-system/css/components.css) - All UI components
- [Implementation Plan](IMPLEMENTATION_PLAN.md) - Step-by-step rollout guide

## 🤝 Contributing

When extending the design system:
1. Follow existing naming conventions
2. Maintain accessibility standards
3. Test across supported browsers
4. Update documentation
5. Add examples to the showcase

## 📞 Support

For questions about implementing the design system, refer to the implementation plan or create an issue in the project repository.

---

**Building community, growing faith, serving others.** ⛪
