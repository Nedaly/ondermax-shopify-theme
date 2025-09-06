# Release Process & Staging Deployment

## Release Workflow

### 1. Pre-Release Checklist
```bash
# Ensure you're on develop branch
git checkout develop
git pull origin develop

# Run all quality checks
npm run lint
npm run format:check

# Test locally
shopify theme dev
# Verify no console errors and all functionality works
```

### 2. Create Release Branch
```bash
# Create release branch from develop
git checkout -b release/v1.0.0

# Update version in package.json (if needed)
npm version patch  # or minor, major
```

### 3. Staging Deployment
```bash
# Set staging theme name
STAGING_THEME="staging-v1.0-rc1"

# Push to unpublished staging theme
shopify theme push --unpublished --path . --theme "$STAGING_THEME"

# Get staging theme URL
shopify theme list | grep "$STAGING_THEME"
```

### 4. QA Testing on Staging
```bash
# Document staging URL for QA team
echo "Staging URL: https://yourstore.myshopify.com/?preview_theme_id=STAGING_THEME_ID"

# Run final checks
npx theme-check
npx prettier --check .
```

### 5. Production Deployment
```bash
# After QA approval, deploy to production
PRODUCTION_THEME_ID="123456789"  # Replace with actual production theme ID

# Push to production theme
shopify theme push --theme-id="$PRODUCTION_THEME_ID"

# Or push to live theme (if you have permissions)
shopify theme push --live
```

### 6. Tag and Merge
```bash
# Tag the release
git tag v1.0.0
git push --tags

# Merge release branch to main
git checkout main
git merge release/v1.0.0
git push origin main

# Merge back to develop
git checkout develop
git merge release/v1.0.0
git push origin develop

# Delete release branch
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

## Staging Theme Management

### Creating Staging Themes
```bash
# Create new staging theme
STAGING_NAME="staging-feature-hero-$(date +%Y%m%d)"
shopify theme push --unpublished --path . --theme "$STAGING_NAME"

# List all staging themes
shopify theme list | grep staging
```

### Staging Theme Naming Convention
- `staging-v1.0-rc1` - Release candidate 1 for version 1.0
- `staging-feature-hero-20240906` - Feature-specific staging
- `staging-hotfix-checkout-20240906` - Hotfix staging
- `staging-qa-final` - Final QA staging

### Cleaning Up Staging Themes
```bash
# List staging themes
shopify theme list | grep staging

# Delete old staging themes (be careful!)
shopify theme delete --theme-id=STAGING_THEME_ID
```

## QA Process

### Staging QA Checklist
- [ ] **Visual Testing**
  - [ ] Desktop layout matches design
  - [ ] Mobile layout is responsive
  - [ ] All images load correctly
  - [ ] Typography is consistent

- [ ] **Functionality Testing**
  - [ ] All buttons and links work
  - [ ] Forms submit correctly
  - [ ] Navigation works on all pages
  - [ ] Search functionality works

- [ ] **Performance Testing**
  - [ ] Page load times are acceptable
  - [ ] No console errors
  - [ ] Mobile performance is good
  - [ ] Images are optimized

- [ ] **Cross-Browser Testing**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Edge (latest)

- [ ] **Mobile Testing**
  - [ ] iOS Safari
  - [ ] Android Chrome
  - [ ] Touch interactions work
  - [ ] Mobile navigation works

### QA Documentation
```bash
# Create QA report
cat > qa-report.md << EOF
# QA Report - Release v1.0.0

## Staging URL
https://yourstore.myshopify.com/?preview_theme_id=STAGING_THEME_ID

## Tested By
- [ ] QA Team Member 1
- [ ] QA Team Member 2

## Test Results
- [ ] Visual Design: ✅ Pass
- [ ] Functionality: ✅ Pass
- [ ] Performance: ✅ Pass
- [ ] Cross-Browser: ✅ Pass
- [ ] Mobile: ✅ Pass

## Issues Found
- None

## Approval
- [ ] Approved for Production
- [ ] Approved by: [Name]
- [ ] Date: [Date]
EOF
```

## Rollback Process

### Emergency Rollback
```bash
# If issues are found in production
PREVIOUS_THEME_ID="123456789"  # Previous working theme ID

# Deploy previous theme
shopify theme push --theme-id="$PREVIOUS_THEME_ID"

# Or restore from backup
git checkout v0.9.0  # Previous stable version
shopify theme push --theme-id="$PRODUCTION_THEME_ID"
```

### Rollback Documentation
```bash
# Document rollback
cat > rollback-log.md << EOF
# Rollback Log

## Date: 2024-09-06
## Version Rolled Back: v1.0.0
## Reason: Critical checkout bug found
## Rolled Back To: v0.9.0
## Action Taken: [Description]
## Resolved By: [Name]
EOF
```

## Release Notes Template

### Creating Release Notes
```bash
# Create release notes
cat > release-notes-v1.0.0.md << EOF
# Release Notes - v1.0.0

## 🎉 New Features
- Hero section with value proposition
- Social proof testimonials
- Mobile-optimized navigation

## 🐛 Bug Fixes
- Fixed checkout form validation
- Resolved mobile menu toggle issue
- Improved image loading performance

## 🔧 Technical Changes
- Updated Shopify CLI to v3.84.1
- Optimized theme loading performance
- Improved accessibility compliance

## 📚 Documentation
- Added development guide
- Updated CRO checklist
- Created release process documentation

## 🚀 Performance
- Reduced page load time by 15%
- Optimized image compression
- Improved mobile performance

## 🔒 Security
- Updated dependencies
- Improved form validation
- Enhanced data sanitization

## 💔 Breaking Changes
- None

## Migration Guide
- No migration required for this release

## Support
For issues or questions, contact the development team.
EOF
```

## Automated Release Script

### Release Script Template
```bash
#!/bin/bash
# release.sh - Automated release script

set -e

VERSION=$1
STAGING_THEME="staging-v${VERSION}-rc1"
PRODUCTION_THEME_ID="123456789"

if [ -z "$VERSION" ]; then
    echo "Usage: ./release.sh <version>"
    echo "Example: ./release.sh 1.0.0"
    exit 1
fi

echo "🚀 Starting release process for v${VERSION}"

# 1. Pre-release checks
echo "📋 Running pre-release checks..."
npm run lint
npm run format:check

# 2. Create release branch
echo "🌿 Creating release branch..."
git checkout develop
git pull origin develop
git checkout -b "release/v${VERSION}"

# 3. Deploy to staging
echo "🎭 Deploying to staging..."
shopify theme push --unpublished --path . --theme "$STAGING_THEME"

# 4. Get staging URL
STAGING_URL=$(shopify theme list | grep "$STAGING_THEME" | awk '{print $NF}')
echo "🔗 Staging URL: $STAGING_URL"

# 5. Wait for QA approval
echo "⏳ Waiting for QA approval..."
echo "Please test the staging theme and approve for production deployment."
read -p "Press Enter when QA is complete and approved..."

# 6. Deploy to production
echo "🚀 Deploying to production..."
shopify theme push --theme-id="$PRODUCTION_THEME_ID"

# 7. Tag and merge
echo "🏷️ Tagging release..."
git tag "v${VERSION}"
git push --tags

git checkout main
git merge "release/v${VERSION}"
git push origin main

git checkout develop
git merge "release/v${VERSION}"
git push origin develop

# 8. Cleanup
git branch -d "release/v${VERSION}"
git push origin --delete "release/v${VERSION}"

echo "✅ Release v${VERSION} completed successfully!"
```

### Using the Release Script
```bash
# Make script executable
chmod +x scripts/release.sh

# Run release
./scripts/release.sh 1.0.0
```

## Best Practices

### Before Release
1. **Complete QA testing** on staging
2. **Document all changes** in release notes
3. **Test rollback procedure** if possible
4. **Notify stakeholders** of release schedule
5. **Prepare monitoring** for post-release

### During Release
1. **Deploy during low-traffic hours**
2. **Monitor for issues** immediately after deployment
3. **Have rollback plan ready**
4. **Keep team available** for quick fixes
5. **Document any issues** encountered

### After Release
1. **Monitor performance metrics**
2. **Check for error reports**
3. **Gather user feedback**
4. **Update documentation** if needed
5. **Plan next release** based on learnings
