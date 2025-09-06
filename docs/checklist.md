# CRO Checklist & CSV ID Reference

## CSV ID Requirements

**Every PR title must include a CSV ID reference in the format: `[CSV-XXX-###]`**

### Examples:
- `[CSV-HP-003] feat(hero): add value proposition section with CTA`
- `[CSV-NAV-001] fix(navigation): resolve mobile menu toggle issue`
- `[CSV-CHK-005] feat(checkout): implement one-click checkout flow`

### CSV ID Categories:
- **HP**: Homepage sections and components
- **NAV**: Navigation and menu systems
- **CHK**: Checkout and cart functionality
- **PROD**: Product pages and related features
- **BLOG**: Blog and content pages
- **FOOT**: Footer and site-wide elements
- **PERF**: Performance optimizations
- **SEO**: SEO and meta improvements

## Pre-Development Checklist

### Planning
- [ ] CSV ID assigned and documented
- [ ] Requirements clearly defined
- [ ] Design mockups approved
- [ ] Technical approach planned
- [ ] Dependencies identified

### Environment Setup
- [ ] Feature branch created from `develop`
- [ ] Local development environment ready
- [ ] Shopify CLI authenticated
- [ ] Development theme pulled

## Development Checklist

### Code Quality
- [ ] Code follows project conventions
- [ ] Liquid templates are semantic and accessible
- [ ] CSS follows BEM methodology
- [ ] JavaScript is vanilla or minimal framework
- [ ] No console errors or warnings
- [ ] Performance impact considered

### Testing
- [ ] Local testing completed (`shopify theme dev`)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness verified
- [ ] Accessibility basics checked
- [ ] Theme editor functionality tested

### CRO Considerations
- [ ] Value proposition is clear and prominent
- [ ] Call-to-action buttons are prominent and actionable
- [ ] Social proof elements included where relevant
- [ ] Trust signals present (reviews, guarantees, etc.)
- [ ] Page load speed optimized
- [ ] Mobile experience prioritized

## Pre-PR Checklist

### Code Review
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run format:check` passes
- [ ] Code reviewed by team member
- [ ] Security considerations addressed
- [ ] Performance impact assessed

### Documentation
- [ ] PR title includes CSV ID
- [ ] PR description explains changes clearly
- [ ] Screenshots included for visual changes
- [ ] Staging URL provided for testing
- [ ] Testing instructions included

### Staging Deployment
- [ ] Changes pushed to unpublished staging theme
- [ ] Staging environment tested thoroughly
- [ ] All functionality verified on staging
- [ ] Performance metrics checked
- [ ] Mobile experience validated

## Post-Merge Checklist

### Production Deployment
- [ ] Release branch created from `develop`
- [ ] Final QA completed on staging
- [ ] Production theme updated
- [ ] Monitoring and analytics verified
- [ ] Rollback plan prepared

### Monitoring
- [ ] Conversion tracking verified
- [ ] Performance metrics monitored
- [ ] Error tracking active
- [ ] User feedback collected
- [ ] A/B test results analyzed (if applicable)

## CRO Best Practices

### Homepage Optimization
- [ ] Above-the-fold value proposition clear
- [ ] Primary CTA visible and compelling
- [ ] Social proof elements strategically placed
- [ ] Navigation is intuitive and fast
- [ ] Page load time under 3 seconds

### Product Pages
- [ ] Product images high-quality and zoomable
- [ ] Product descriptions compelling and detailed
- [ ] Add to cart button prominent
- [ ] Related products suggested
- [ ] Reviews and ratings displayed

### Checkout Process
- [ ] Guest checkout option available
- [ ] Progress indicators clear
- [ ] Form fields minimal and logical
- [ ] Trust signals throughout process
- [ ] Mobile checkout optimized

### Performance
- [ ] Images optimized and lazy-loaded
- [ ] CSS and JS minified
- [ ] Third-party scripts minimized
- [ ] Core Web Vitals optimized
- [ ] Mobile performance prioritized

## CSV ID Tracking

### How to Get a CSV ID
1. Contact the CRO team or project manager
2. Provide brief description of the change
3. Specify the page/section affected
4. Get assigned CSV ID before starting development

### CSV ID Documentation
- Each CSV ID should be documented with:
  - Description of the change
  - Expected impact on conversion
  - Success metrics to track
  - Implementation timeline
  - Testing requirements

### CSV ID Examples by Category

**Homepage (HP)**
- CSV-HP-001: Hero section redesign
- CSV-HP-002: Product showcase carousel
- CSV-HP-003: Value proposition messaging
- CSV-HP-004: Social proof testimonials

**Navigation (NAV)**
- CSV-NAV-001: Mobile menu optimization
- CSV-NAV-002: Search functionality improvement
- CSV-NAV-003: Category navigation redesign

**Checkout (CHK)**
- CSV-CHK-001: One-click checkout implementation
- CSV-CHK-002: Guest checkout optimization
- CSV-CHK-003: Payment method selection

Remember: **No PR will be merged without a proper CSV ID in the title!**
