# First Baptist Church Fenton Design System Implementation Plan

## Overview
This document outlines a comprehensive plan to implement the new design system based on your Figma design guide. The design system features warm, welcoming colors (Orange Peel and Copper Rust palettes) with clean neutrals, paired with the elegant Cardo + Proza Libre typography combination perfect for a church website.

## Phase 1: Foundation Setup (Week 1)

### 1.1 Environment Setup
- [ ] Install required fonts (Cardo and Proza Libre from Google Fonts)
- [ ] Set up design system file structure
- [ ] Import design tokens and CSS variables
- [ ] Create base reset/normalize styles

### 1.2 Typography Implementation
- [ ] Implement responsive typography scale (desktop/mobile)
- [ ] Set up font loading strategy for performance
- [ ] Test font fallbacks for accessibility
- [ ] Create typography utility classes

### 1.3 Color System Implementation
- [ ] Implement color variables and schemes
- [ ] Test color contrast ratios for accessibility (WCAG AA)
- [ ] Create color utility classes
- [ ] Set up dark mode support (if required)

## Phase 2: Component Library (Week 2-3)

### 2.1 Core Components
Priority components to implement first:

#### Buttons (High Priority)
- [ ] Primary button (Orange Peel base)
- [ ] Secondary button (outlined)
- [ ] Ghost button
- [ ] Icon buttons
- [ ] Button states (hover, active, disabled)
- [ ] Size variations (small, medium, large)

#### Form Elements (High Priority)
- [ ] Text inputs
- [ ] Search inputs with icon
- [ ] Textareas
- [ ] Select dropdowns
- [ ] Checkboxes and radios
- [ ] Toggle switches
- [ ] Form validation states
- [ ] Form labels and help text

#### Cards (Medium Priority)
- [ ] Basic card component
- [ ] Elevated card variant
- [ ] Card with header/content/actions
- [ ] Hover effects and transitions

### 2.2 Navigation Components
- [ ] Primary navigation
- [ ] Breadcrumbs
- [ ] Pagination
- [ ] Tabs
- [ ] Filters

### 2.3 Interactive Components
- [ ] Tooltips
- [ ] Modal dialogs
- [ ] Dropdown menus
- [ ] Sliders/carousels with arrows
- [ ] Accordion/collapsible content

## Phase 3: Layout System (Week 3-4)

### 3.1 Grid System
- [ ] 12-column responsive grid
- [ ] Container classes
- [ ] Spacing utilities
- [ ] Breakpoint system

### 3.2 Page Layouts
- [ ] Header layout
- [ ] Footer layout
- [ ] Main content areas
- [ ] Sidebar layouts
- [ ] Full-width sections

### 3.3 Responsive Design
- [ ] Mobile-first approach implementation
- [ ] Tablet optimizations
- [ ] Desktop enhancements
- [ ] Testing across devices

## Phase 4: Church-Specific Components (Week 4-5)

### 4.1 Ministry Components
- [ ] Service time cards
- [ ] Event cards
- [ ] Staff/leadership cards
- [ ] Ministry team sections
- [ ] Testimonial cards

### 4.2 Content Components
- [ ] Sermon series cards
- [ ] News/blog post cards
- [ ] Photo galleries
- [ ] Video player integration
- [ ] Social media integration

### 4.3 Engagement Components
- [ ] Contact forms
- [ ] Prayer request forms
- [ ] Event registration
- [ ] Newsletter signup
- [ ] Donation/giving integration

## Phase 5: Content Migration (Week 5-6)

### 5.1 Audit Current Content
- [ ] Inventory existing pages
- [ ] Identify content that needs updating
- [ ] Plan content restructuring
- [ ] Prepare new imagery needs

### 5.2 Page-by-Page Implementation
- [ ] Homepage redesign
- [ ] About Us pages
- [ ] Ministries pages
- [ ] Events calendar
- [ ] Contact page
- [ ] Sermons/media pages

### 5.3 Content Optimization
- [ ] Optimize images for web
- [ ] Update copy to match new design
- [ ] Ensure accessibility compliance
- [ ] SEO optimization

## Phase 6: Testing & Optimization (Week 6-7)

### 6.1 Cross-Browser Testing
- [ ] Chrome, Firefox, Safari, Edge
- [ ] Mobile browsers
- [ ] Accessibility testing
- [ ] Performance testing

### 6.2 User Testing
- [ ] Test with congregation members
- [ ] Gather feedback on usability
- [ ] Test forms and interactions
- [ ] Mobile experience testing

### 6.3 Performance Optimization
- [ ] Image optimization
- [ ] CSS/JS minification
- [ ] Font loading optimization
- [ ] Core Web Vitals optimization

## Phase 7: Launch & Maintenance (Week 7-8)

### 7.1 Pre-Launch
- [ ] Final review and testing
- [ ] Content proofreading
- [ ] Analytics setup
- [ ] Backup current site

### 7.2 Launch
- [ ] Deploy new design
- [ ] Monitor for issues
- [ ] Gather initial feedback
- [ ] Make immediate fixes

### 7.3 Post-Launch
- [ ] Monitor analytics
- [ ] Collect user feedback
- [ ] Plan future enhancements
- [ ] Document maintenance procedures

## Technical Implementation Guidelines

### CSS Architecture
```
design-system/
├── tokens/
│   └── design-tokens.json
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── typography.css
│   ├── components.css
│   └── utilities.css
└── js/
    └── components/
```

### Color Scheme Usage
- **Scheme 1**: Main content areas (white background)
- **Scheme 2**: Featured sections (orange accent background)
- **Scheme 3**: Secondary content (light neutral background)
- **Scheme 4**: Special sections (copper rust accent background)

### Typography Scale Implementation
```css
/* Desktop */
H1: 48px/1.2 Cardo Bold
H2: 40px/1.2 Cardo Bold
H3: 32px/1.3 Cardo Bold
Body: 16px/1.5 Proza Libre Regular

/* Mobile */
H1: 32px/1.2 Cardo Bold
H2: 28px/1.2 Cardo Bold
H3: 24px/1.3 Cardo Bold
Body: 16px/1.5 Proza Libre Regular
```

### Component Naming Convention
- Use BEM methodology: `.component__element--modifier`
- Prefix with design system: `.fbcf-button`, `.fbcf-card`
- Maintain consistency with design tokens

## Key Success Metrics

### Performance Targets
- Page load time < 3 seconds
- Core Web Vitals in "Good" range
- Accessibility score > 95%
- Mobile usability score > 90%

### User Experience Goals
- Improved navigation clarity
- Enhanced mobile experience
- Consistent visual hierarchy
- Better content discoverability

## Risk Mitigation

### Technical Risks
- **Browser compatibility**: Test early and often
- **Performance issues**: Optimize images and code
- **Accessibility concerns**: Follow WCAG guidelines

### Content Risks
- **Missing content**: Audit thoroughly before migration
- **Broken links**: Implement redirect strategy
- **SEO impact**: Maintain URL structure where possible

## Resource Requirements

### Design Resources
- Figma design system (✓ Complete)
- Component library documentation
- Style guide for content creators

### Development Resources
- CSS variables and component library
- JavaScript for interactive components
- Testing and optimization tools

### Content Resources
- Professional photography
- Updated copy and messaging
- Ministry and staff information

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| 1 | Week 1 | Foundation setup, typography, colors |
| 2 | Week 2-3 | Core component library |
| 3 | Week 3-4 | Layout system, responsive design |
| 4 | Week 4-5 | Church-specific components |
| 5 | Week 5-6 | Content migration |
| 6 | Week 6-7 | Testing & optimization |
| 7 | Week 7-8 | Launch & post-launch support |

## Next Steps

1. **Review and approve this implementation plan**
2. **Set up development environment**
3. **Begin Phase 1: Foundation setup**
4. **Schedule regular check-ins for progress review**
5. **Prepare content audit and migration strategy**

This implementation plan ensures a systematic approach to converting your website to the beautiful new design system, maintaining quality and minimizing risks throughout the process. 