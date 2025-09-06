# Development Guide

## Quick Start

### 1. Environment Setup
```bash
# Ensure you're using Node.js LTS via nvm
nvm use --lts

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your store details
```

### 2. Shopify CLI Login
```bash
# Login to your Shopify store
shopify login --store yourstore.myshopify.com

# List available themes
shopify theme list

# Pull the development theme
shopify theme pull --store yourstore.myshopify.com
# Select your dev theme when prompted
```

### 3. Local Development
```bash
# Start the development server
shopify theme dev

# This will:
# - Start a local server (usually http://127.0.0.1:9292)
# - Provide a preview URL for testing
# - Enable hot reloading for changes
# - Allow theme editor access via the preview URL
```

### 4. Development Workflow
```bash
# Create a new feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Make your changes
# Edit Liquid templates, CSS, JS, etc.

# Test locally
shopify theme dev

# Run linting and formatting
npm run lint
npm run format

# Commit with conventional format
git add .
git commit -m "feat(section): add new hero section with CTA"

# Push and create PR
git push origin feature/your-feature-name
```

## Theme Structure

```
├── assets/          # CSS, JS, images
├── config/          # Theme settings
├── layout/          # Base templates
├── locales/         # Translation files
├── sections/        # Reusable sections
├── snippets/        # Reusable components
└── templates/       # Page templates
```

## Key Commands

### Shopify CLI
- `shopify theme dev` - Start development server
- `shopify theme pull` - Download theme from store
- `shopify theme push` - Upload theme to store
- `shopify theme list` - List all themes
- `shopify theme delete` - Delete a theme

### Development Tools
- `npm run lint` - Run theme-check
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without changes

## QA Process

### Before Creating PR
1. **Local Testing**
   - [ ] `shopify theme dev` runs without errors
   - [ ] No console errors in browser
   - [ ] All functionality works as expected
   - [ ] Responsive design tested on mobile/desktop

2. **Code Quality**
   - [ ] `npm run lint` passes with no warnings
   - [ ] `npm run format:check` passes
   - [ ] Code follows project conventions

3. **Staging Deployment**
   - [ ] Push to unpublished staging theme
   - [ ] Test on staging environment
   - [ ] Document staging URL in PR

### PR Requirements
- [ ] PR title includes CSV ID: `[CSV-HP-003] feat(hero): add value proposition`
- [ ] Screenshots included
- [ ] Staging URL provided
- [ ] Description explains changes and testing done

## Troubleshooting

### Common Issues

**Theme not found**
```bash
# Check if theme exists
shopify theme list

# Pull specific theme by ID
shopify theme pull --theme-id=123456789
```

**Permission errors**
```bash
# Re-login to Shopify
shopify logout
shopify login --store yourstore.myshopify.com
```

**Development server issues**
```bash
# Clear cache and restart
rm -rf .shopify/
shopify theme dev
```

**Linting errors**
```bash
# Check specific file
npx theme-check sections/your-section.liquid

# Auto-fix formatting
npm run format
```

## Best Practices

1. **Always work on feature branches** - Never commit directly to `main` or `develop`
2. **Test locally first** - Use `shopify theme dev` before pushing
3. **Follow naming conventions** - Use descriptive branch and commit names
4. **Keep commits atomic** - One logical change per commit
5. **Document changes** - Include clear PR descriptions and screenshots
6. **Use staging themes** - Test on staging before production deployment
