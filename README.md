# Ondermax Shopify Theme

A modern, conversion-optimized Shopify theme built with performance and user experience in mind.

## 🚀 Quick Start

### Prerequisites
- Node.js LTS (via nvm recommended)
- Shopify CLI
- Git

### Setup
```bash
# Clone the repository
git clone git@github.com:YOUR_ORG_OR_USERNAME/ondermax-shopify-theme.git
cd ondermax-shopify-theme

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your store details

# Login to Shopify
shopify login --store yourstore.myshopify.com

# Pull development theme
shopify theme pull --store yourstore.myshopify.com

# Start development server
shopify theme dev
```

## 📋 Git Flow

This project follows Git Flow branching strategy:

```
main (production)
├── develop (integration)
│   ├── feature/hero-value-prop
│   ├── feature/navigation-redesign
│   └── feature/checkout-optimization
├── release/v1.0.0
└── hotfix/critical-bug-fix
```

### Branch Types
- **main**: Production-ready code, always deployable
- **develop**: Integration branch for features, always stable
- **feature/***: New features developed from `develop`
- **release/***: Release preparation from `develop` to `main`
- **hotfix/***: Critical fixes directly to `main`

### Workflow
1. Create feature branch from `develop`
2. Develop and test locally
3. Create PR to `develop`
4. After review, merge to `develop`
5. Create release branch for production deployment

## 🛠️ Development Commands

```bash
# Development
shopify theme dev          # Start development server
shopify theme pull         # Pull theme from store
shopify theme push         # Push theme to store

# Code Quality
npm run lint              # Run theme-check
npm run format            # Format code with Prettier
npm run format:check      # Check formatting

# Git
git checkout -b feature/your-feature-name
git commit -m "feat(section): add new hero section"
```

## 📁 Project Structure

```
├── assets/              # CSS, JS, images
│   ├── application.css
│   ├── application.js
│   └── images/
├── config/              # Theme settings
│   └── settings_schema.json
├── layout/              # Base templates
│   └── theme.liquid
├── locales/             # Translation files
├── sections/            # Reusable sections
│   ├── hero-value.liquid
│   └── social-proof.liquid
├── snippets/            # Reusable components
├── templates/           # Page templates
├── docs/                # Documentation
├── scripts/             # Development scripts
└── .theme-check.yml     # Theme check configuration
```

## ✅ Definition of Done

Before any feature is considered complete, ensure:

### Local Development
- [ ] `shopify theme dev` runs without errors
- [ ] No console errors in browser
- [ ] All functionality works as expected
- [ ] Responsive design tested on mobile/desktop

### Code Quality
- [ ] `theme-check` passes with no warnings
- [ ] Prettier formatting applied
- [ ] Code follows project conventions
- [ ] Performance impact considered

### Testing & QA
- [ ] Pushed as unpublished staging theme
- [ ] Staging environment tested thoroughly
- [ ] Cross-browser compatibility verified
- [ ] Mobile experience validated

### Documentation & Process
- [ ] PR created to `develop` with screenshots
- [ ] PR title references CSV ID: `[CSV-HP-003]`
- [ ] Staging URL provided for QA
- [ ] Code reviewed and approved

## 🎯 CRO Focus Areas

### Homepage Optimization
- Clear value proposition above the fold
- Prominent and compelling CTAs
- Strategic social proof placement
- Fast loading and intuitive navigation

### Product Experience
- High-quality product imagery
- Compelling product descriptions
- Easy add-to-cart process
- Related product suggestions

### Checkout Optimization
- Guest checkout available
- Clear progress indicators
- Minimal form fields
- Trust signals throughout

### Performance
- Core Web Vitals optimized
- Mobile-first approach
- Image optimization and lazy loading
- Minimal third-party scripts

## 📚 Documentation

- [Development Guide](docs/dev-guide.md) - Detailed setup and workflow
- [CRO Checklist](docs/checklist.md) - Conversion optimization guidelines
- [Changelog](docs/changelog.md) - Version history and changes
- [Contributing Guidelines](CONTRIBUTING.md) - Git Flow and commit conventions

## 🔧 Tools & Configuration

### Code Quality
- **Prettier**: Code formatting
- **Theme Check**: Shopify theme validation
- **Husky**: Git hooks for quality gates
- **lint-staged**: Pre-commit linting

### Development
- **Shopify CLI**: Theme development and deployment
- **Git Flow**: Branching strategy
- **Conventional Commits**: Standardized commit messages

## 🚀 Deployment

### Staging
```bash
# Create release branch
git checkout -b release/v1.0.0

# Push to staging theme
shopify theme push --unpublished --path . --theme "staging-v1.0-rc1"
```

### Production
```bash
# Tag release
git tag v1.0.0
git push --tags

# Deploy to production theme
shopify theme push --path . --theme "production"
```

## 🤝 Contributing

1. Follow the [Contributing Guidelines](CONTRIBUTING.md)
2. Use conventional commit messages
3. Include CSV ID in PR titles
4. Test thoroughly before submitting PR
5. Provide screenshots and staging URLs

## 📞 Support

For questions or issues:
- Check the [Development Guide](docs/dev-guide.md)
- Review the [CRO Checklist](docs/checklist.md)
- Create an issue in the repository

---

**Remember**: Every PR must include a CSV ID reference in the title format: `[CSV-XXX-###]`
