# Development Guide

## Quick Start Commands

### Setup

```bash
# Login to Shopify store
shopify theme login --store ondermax.myshopify.com

# List available themes
shopify theme list --store ondermax.myshopify.com

# Pull development theme
shopify theme pull --store ondermax.myshopify.com --theme <THEME_ID>
```

### Development

```bash
# Start development server
npm run dev

# Check theme for issues
npm run check

# Format code
npm run format

# Check formatting
npm run format:check
```

### Deployment

```bash
# Push to staging (unpublished)
npm run push:staging

# Push to production (be careful!)
shopify theme push --live
```

## Workflow

1. **Create feature branch**: `git checkout -b feature/your-feature-name`
2. **Make changes**: Edit Liquid templates, CSS, JS
3. **Test locally**: `npm run dev`
4. **Check quality**: `npm run check` and `npm run format:check`
5. **Commit**: `git commit -m "feat: your changes"`
6. **Push**: `git push origin feature/your-feature-name`
7. **Create PR**: Include CSV ID in title: `[CSV-HP-003] feat: your changes`

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

## Best Practices

- Always work on feature branches
- Test locally before pushing
- Use conventional commit messages
- Include CSV IDs in PR titles
- Run quality checks before committing
