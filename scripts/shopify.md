# Shopify CLI Commands Reference

## Authentication & Setup

### Login to Shopify Store
```bash
# Login to your store
shopify login --store yourstore.myshopify.com

# Verify login status
shopify auth status
```

### Store Information
```bash
# List all themes in your store
shopify theme list

# Get store information
shopify store info
```

## Theme Management

### Pulling Themes
```bash
# Pull all themes (will prompt for selection)
shopify theme pull --store yourstore.myshopify.com

# Pull specific theme by name
shopify theme pull --store yourstore.myshopify.com --theme "dev-theme-2024-09-06"

# Pull specific theme by ID
shopify theme pull --store yourstore.myshopify.com --theme-id=123456789

# Pull to specific directory
shopify theme pull --store yourstore.myshopify.com --path ./theme-files
```

### Development Server
```bash
# Start development server (recommended)
shopify theme dev

# Start with specific store
shopify theme dev --store yourstore.myshopify.com

# Start with specific theme
shopify theme dev --theme "dev-theme-2024-09-06"

# Start with custom port
shopify theme dev --port 3000

# Start with live reload disabled
shopify theme dev --no-live-reload
```

### Pushing Themes
```bash
# Push to unpublished theme
shopify theme push --unpublished --path . --theme "staging-v1.0-rc1"

# Push to specific theme ID
shopify theme push --theme-id=123456789

# Push to live theme (be careful!)
shopify theme push --live

# Push with force (overwrites existing theme)
shopify theme push --force
```

## Theme Operations

### Theme Information
```bash
# Get theme details
shopify theme info

# List theme files
shopify theme list-files

# Check theme for issues
shopify theme check
```

### Theme Deletion
```bash
# Delete a theme (be careful!)
shopify theme delete --theme-id=123456789

# Delete with confirmation
shopify theme delete --theme-id=123456789 --force
```

## Development Workflow

### Complete Development Setup
```bash
# 1. Login to store
shopify login --store yourstore.myshopify.com

# 2. List available themes
shopify theme list

# 3. Pull development theme
shopify theme pull --store yourstore.myshopify.com
# Select your dev theme when prompted

# 4. Start development server
shopify theme dev

# 5. Make your changes in the code editor
# 6. Test changes in the browser (usually http://127.0.0.1:9292)
# 7. Use the preview URL to access theme editor
```

### Staging Deployment
```bash
# 1. Create staging theme name
STAGING_THEME="staging-v1.0-rc1"

# 2. Push to unpublished staging theme
shopify theme push --unpublished --path . --theme "$STAGING_THEME"

# 3. Get staging theme URL
shopify theme list | grep "$STAGING_THEME"
```

### Production Deployment
```bash
# 1. Final testing on staging
# 2. Push to production theme
shopify theme push --theme-id=PRODUCTION_THEME_ID

# 3. Or push to live theme (if you have permissions)
shopify theme push --live
```

## Troubleshooting

### Common Issues

**Authentication Problems**
```bash
# Re-authenticate
shopify logout
shopify login --store yourstore.myshopify.com
```

**Theme Not Found**
```bash
# Check available themes
shopify theme list

# Pull with specific theme name
shopify theme pull --theme "exact-theme-name"
```

**Permission Errors**
```bash
# Check your store permissions
shopify store info

# Ensure you have theme development permissions
```

**Development Server Issues**
```bash
# Clear Shopify CLI cache
rm -rf .shopify/

# Restart development server
shopify theme dev
```

**Port Already in Use**
```bash
# Use different port
shopify theme dev --port 3001

# Kill process using port 9292
lsof -ti:9292 | xargs kill -9
```

## Environment Variables

### Required Variables
```bash
# Store URL
SHOPIFY_FLAG_STORE=yourstore.myshopify.com

# Disable TTY for CI/CD
SHOPIFY_CLI_TTY=0
```

### Optional Variables
```bash
# Storefront API
PUBLIC_STOREFRONT_API_TOKEN=your_token_here
PUBLIC_STOREFRONT_API_VERSION=2024-07
PUBLIC_STOREFRONT_DOMAIN=yourstore.myshopify.com

# Theme ID (if known)
THEME_ID=123456789

# Development theme name
DEV_THEME_NAME=dev-theme-2024-09-06
```

## Best Practices

### Development
1. **Always work on development themes** - Never work directly on live themes
2. **Use descriptive theme names** - Include date and purpose (e.g., `dev-theme-2024-09-06`)
3. **Test locally first** - Use `shopify theme dev` before pushing
4. **Use staging themes** - Test on staging before production

### Deployment
1. **Create staging themes** - Use unpublished themes for QA
2. **Document staging URLs** - Include in PR descriptions
3. **Test thoroughly** - Verify all functionality on staging
4. **Use version tags** - Tag releases for easy rollback

### Security
1. **Never commit .env files** - Use .env.example instead
2. **Use environment variables** - Store sensitive data securely
3. **Limit permissions** - Use development-only access when possible
4. **Regular authentication** - Re-authenticate periodically

## Integration with Git Flow

### Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/hero-value-prop

# 2. Pull latest theme
shopify theme pull --store yourstore.myshopify.com

# 3. Start development
shopify theme dev

# 4. Make changes and test
# 5. Commit changes
git add .
git commit -m "feat(hero): add value proposition section"

# 6. Push to staging for QA
shopify theme push --unpublished --path . --theme "staging-hero-v1"
```

### Release Process
```bash
# 1. Create release branch
git checkout -b release/v1.0.0

# 2. Final testing on staging
shopify theme push --unpublished --path . --theme "staging-v1.0-rc1"

# 3. Deploy to production
shopify theme push --theme-id=PRODUCTION_THEME_ID

# 4. Tag release
git tag v1.0.0
git push --tags
```
