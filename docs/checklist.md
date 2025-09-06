# CRO Checklist

## PR Requirements

**Every PR title must include a CSV ID reference in the format: `[CSV-XXX-###]`**

### Examples:

- `[CSV-HP-003] feat(hero): add value proposition section`
- `[CSV-NAV-001] fix(navigation): resolve mobile menu issue`
- `[CSV-CHK-005] feat(checkout): implement one-click checkout`

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

- [ ] CSV ID assigned and documented
- [ ] Requirements clearly defined
- [ ] Design mockups approved
- [ ] Technical approach planned

## Development Checklist

- [ ] Feature branch created from `develop`
- [ ] Local development environment ready
- [ ] Code follows project conventions
- [ ] No console errors or warnings
- [ ] Performance impact considered

## Pre-PR Checklist

- [ ] `npm run check` passes
- [ ] `npm run format:check` passes
- [ ] Code reviewed by team member
- [ ] Screenshots included for visual changes
- [ ] Staging URL provided for testing

## Post-Merge Checklist

- [ ] Release branch created from `develop`
- [ ] Final QA completed on staging
- [ ] Production theme updated
- [ ] Monitoring and analytics verified

## CRO Best Practices

### Homepage Optimization

- [ ] Above-the-fold value proposition clear
- [ ] Primary CTA visible and compelling
- [ ] Social proof elements strategically placed
- [ ] Page load time under 3 seconds

### Product Pages

- [ ] Product images high-quality and zoomable
- [ ] Product descriptions compelling and detailed
- [ ] Add to cart button prominent
- [ ] Related products suggested

### Checkout Process

- [ ] Guest checkout option available
- [ ] Progress indicators clear
- [ ] Form fields minimal and logical
- [ ] Trust signals throughout process

**Remember: No PR will be merged without a proper CSV ID in the title!**
