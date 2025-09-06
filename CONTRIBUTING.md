# Contributing to Ondermax Shopify Theme

## Git Flow Workflow

This project follows Git Flow branching strategy:

### Main Branches
- **main**: Production-ready code, always deployable
- **develop**: Integration branch for features, always stable

### Supporting Branches
- **feature/***: New features developed from `develop`
- **release/***: Release preparation from `develop` to `main`
- **hotfix/***: Critical fixes directly to `main`

### Branch Naming Convention
```
feature/hero-value-prop
feature/navigation-redesign
release/v1.2.0
hotfix/critical-checkout-bug
```

## Conventional Commits

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **chore**: Changes to build process or auxiliary tools
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **perf**: A code change that improves performance

### Examples
```
feat(hero): add value proposition section with CTA
fix(checkout): resolve payment form validation error
chore(deps): update Shopify CLI to v3.84.1
docs(readme): add development setup instructions
style(buttons): improve hover states and transitions
refactor(navigation): simplify mobile menu logic
perf(images): optimize hero banner loading
```

## Pull Request Requirements

### PR Title Format
Include CSV ID reference in every PR title:
```
[CSV-HP-003] feat(hero): add value proposition section
[CSV-NAV-001] fix(navigation): resolve mobile menu toggle
```

### Definition of Done
- [ ] Local preview works without console errors
- [ ] `theme-check` passes with no warnings
- [ ] Prettier formatting applied
- [ ] Pushed as unpublished staging theme for QA
- [ ] PR includes screenshots and staging URLs
- [ ] PR title references CSV ID
- [ ] Code reviewed and approved

## Development Workflow

1. **Start Feature**: `git checkout develop && git pull && git checkout -b feature/your-feature-name`
2. **Develop**: Make changes, commit with conventional format
3. **Test**: Run `shopify theme dev` and verify functionality
4. **Lint**: Ensure `theme-check` and `prettier` pass
5. **Push**: Create PR to `develop` branch
6. **Review**: Address feedback and merge when approved

## Release Process

1. **Create Release**: `git checkout develop && git checkout -b release/v1.0.0`
2. **Test**: Push to staging theme for final QA
3. **Tag**: `git tag v1.0.0 && git push --tags`
4. **Merge**: PR to `main` and `develop`
5. **Deploy**: Push to production theme

## Commitlint Configuration

While we don't enforce commitlint automatically yet, please follow the conventional commit format. Future setup will include:

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [2, "always", ["feat", "fix", "chore", "refactor", "docs", "style", "perf"]]
  }
}
```
