# Theme Rotation Strategy

## 🎯 Overview

This document outlines our theme rotation strategy for safe development, testing, and deployment without overwriting production themes.

## 📋 Theme Naming Convention

### Format
```
ondermax-shopify-theme-{environment}-{version}
```

### Environments
- **production**: Live theme for customers
- **staging**: Pre-production testing
- **develop**: Development environment
- **feature**: Feature branch themes (includes branch name)

### Examples
```
ondermax-shopify-theme-production-v1.2.2
ondermax-shopify-theme-staging-v1.2.3
ondermax-shopify-theme-develop-v1.2.4
ondermax-shopify-theme-feature-taha-review-v1.2.5
```

## 🚀 Development Workflow

### 1. Feature Development
```bash
# Create new feature theme
./scripts/theme-rotation.sh create feature v1.2.5

# Work on your feature
shopify theme dev --theme "ondermax-shopify-theme-feature-{branch}-v1.2.5"

# Test your changes
# ... make changes ...

# When done, delete the feature theme
./scripts/theme-rotation.sh delete feature v1.2.5
```

### 2. Staging Deployment
```bash
# Create staging theme
./scripts/theme-rotation.sh create staging v1.2.3

# Deploy to staging
shopify theme push --theme "ondermax-shopify-theme-staging-v1.2.3"

# Test staging
# ... QA testing ...

# Promote to production when ready
```

### 3. Production Deployment
```bash
# Create new production theme
./scripts/theme-rotation.sh create production v1.2.4

# Deploy to production
shopify theme push --theme "ondermax-shopify-theme-production-v1.2.4"

# Publish the theme
shopify theme publish --theme "ondermax-shopify-theme-production-v1.2.4"
```

## 🛡️ Safety Rules

### ✅ DO
- Always create new themes for development
- Use version numbers for tracking
- Test on staging before production
- Delete old feature themes after merge
- Keep production theme names consistent

### ❌ DON'T
- Never overwrite production themes
- Don't use generic names like "test" or "temp"
- Don't leave old themes hanging around
- Don't deploy directly to production without staging

## 📊 Theme Management

### List All Themes
```bash
./scripts/theme-rotation.sh list
```

### Create New Theme
```bash
./scripts/theme-rotation.sh create staging v1.2.3
./scripts/theme-rotation.sh create feature v1.2.4
```

### Delete Theme
```bash
./scripts/theme-rotation.sh delete feature v1.2.4
```

## 🔄 Version Management

### Version Numbering
- **Major**: Breaking changes (v2.0.0)
- **Minor**: New features (v1.3.0)
- **Patch**: Bug fixes (v1.2.1)

### Version History
- Keep track of what each version contains
- Document breaking changes
- Maintain rollback capability

## 🎯 Best Practices

### 1. Feature Branches
- Create theme for each feature branch
- Use descriptive branch names
- Clean up after merge

### 2. Testing Strategy
- Test on feature theme first
- Move to staging for QA
- Final testing on production theme before publish

### 3. Rollback Strategy
- Keep previous production theme as backup
- Document rollback procedures
- Test rollback process regularly

## 📝 Integration with Git Flow

### Feature Development
```bash
# Start feature
git checkout -b feature/new-announcement-bar
./scripts/theme-rotation.sh create feature v1.2.5

# Work on feature
# ... development ...

# Finish feature
git add .
git commit -m "feat: add new announcement bar"
git push origin feature/new-announcement-bar

# Clean up
./scripts/theme-rotation.sh delete feature v1.2.5
```

### Release Process
```bash
# Create release branch
git checkout -b release/v1.3.0
./scripts/theme-rotation.sh create staging v1.3.0

# Deploy to staging
# ... testing ...

# Deploy to production
./scripts/theme-rotation.sh create production v1.3.0
# ... final testing ...
# ... publish ...
```

## 🚨 Emergency Procedures

### Rollback Production
```bash
# List current themes
./scripts/theme-rotation.sh list

# Publish previous version
shopify theme publish --theme "ondermax-shopify-theme-production-v1.2.1"
```

### Emergency Fix
```bash
# Create hotfix theme
./scripts/theme-rotation.sh create production v1.2.2-hotfix

# Apply fix
# ... emergency fix ...

# Deploy and publish
shopify theme push --theme "ondermax-shopify-theme-production-v1.2.2-hotfix"
shopify theme publish --theme "ondermax-shopify-theme-production-v1.2.2-hotfix"
```

## 📊 Monitoring & Analytics

### Theme Performance
- Track conversion rates per theme version
- Monitor page load times
- A/B test different versions

### Usage Tracking
- Document which themes are active
- Track theme usage patterns
- Monitor theme storage usage

---

**Last Updated**: September 20, 2025  
**Version**: 1.0.0
