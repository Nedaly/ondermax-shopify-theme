# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [v1.6.0] - 2025-11-26

### Added

- **Anti-Dopamine Product Template**: New dedicated product template and sections for anti-dopamine product line
- **Product Launch Variants**: Enhanced product launch templates with version1 variants for A/B testing
- **Recently Purchase Section**: New social proof section showing recent customer activity
- **Custom Announcement Bar**: Enhanced announcement bar with custom styling and functionality
- **Product Benefit Snippets**: Reusable benefit display components with check icons
- **How It Works Page**: New dedicated page template for product explanation flow

### Changed

- **Header Group Configuration**: Updated header group JSON with improved navigation structure
- **Product Stack Section**: Enhanced main product stack display with better UX
- **Main Product Section**: Improved product page layout and functionality
- **Profile Info Section**: Updated user profile information display
- **Base CSS & Ondermax Styles**: Refined styling for better visual consistency
- **Locale Updates**: Enhanced Arabic and English translations for new features

### Fixed

- **Production Sync**: Synchronized all production changes with development branch
- **Theme Integrity**: Maintained Shrine auth/loader configuration during sync
- **Settings Data**: Updated configuration settings to match production environment

## [v1.5.0] - 2025-09-30

### Added

- **CRO-Optimized Subscription Section**: Enhanced subscription options with conversion-focused benefits display
- **Currency Symbol Support**: Fixed currency symbol display in subscription pricing with JavaScript fallback
- **Hardcoded CRO Benefits**: Reliable CRO benefits display using hardcoded text in custom_liquid blocks
- **Enhanced JavaScript Fallback**: Improved price formatting with manual currency symbol addition
- **Subscription UX Improvements**: Streamlined subscription flow with 3 key benefits for better conversion

### Changed

- **Subscription Pricing Display**: Updated JavaScript to ensure currency symbols always appear
- **CRO Benefits Layout**: Reduced from 4 to 3 benefits for cleaner, more focused presentation
- **Template Structure**: Enhanced JSON template with proper escaping for custom_liquid content
- **Price Formatting Logic**: Improved fallback handling when Shopify.formatMoney fails

### Fixed

- **Currency Symbol Missing**: Resolved issue where subscription prices showed numbers without currency symbols
- **JSON Template Errors**: Fixed JSON syntax errors caused by unescaped quotes in custom_liquid blocks
- **Translation Missing**: Eliminated "Translation missing" errors in CRO benefits section
- **JavaScript Override Issues**: Prevented JavaScript from overriding Liquid-rendered price displays
- **Template Validation**: Ensured all JSON templates pass validation checks

### Security

- **Safe JSON Escaping**: Implemented proper escaping for all dynamic content in templates
- **No External Dependencies**: All improvements use native Shopify/Liquid functionality

## [v1.4.0] - 2025-09-24

### Added

- **Native Shopify i18n Migration**: Complete migration from Weglot/Transcy to Shopify's native internationalization system
- **Arabic & Hebrew Font Support**: IBM Plex Sans Arabic (400, 600) and Heebo (400, 600) WOFF2 fonts with conditional loading
- **RTL Layout Support**: Complete right-to-left layout support for Arabic and Hebrew languages
- **Translation Key System**: Structured translation keys (`ui.*`, `home.blocks.*`, `power_bar.*`) for all UI elements
- **Pure-Liquid Fallback**: Safe translation handling for merchant-editable content without "Translation missing" errors
- **Comprehensive Documentation**: Cursor instructions, commit audit reports, and development guidelines

### Changed

- **Theme Structure**: Removed all Weglot/Transcy artifacts and dependencies
- **Font Loading**: Implemented conditional CSS loading based on locale (`lang-ar.css`, `lang-he.css`, `rtl.css`)
- **Footer Typography**: Ensured Arabic/Hebrew fonts apply theme-wide including footer components
- **Development Workflow**: Streamlined development process with comprehensive playbooks and QA procedures

### Removed

- **Third-party Translation Apps**: Completely removed Weglot and Transcy dependencies
- **Development Artifacts**: Cleaned up development files, backup directories, and testing infrastructure
- **Hardcoded English Strings**: Replaced all hardcoded English UI text with translation keys

### Fixed

- **Translation Missing Errors**: Eliminated all "Translation missing" errors through proper fallback handling
- **Font Consistency**: Ensured consistent Arabic/Hebrew font rendering across all theme components
- **RTL Layout Issues**: Fixed right-to-left layout problems for Arabic and Hebrew content
- **Shrine Integration**: Maintained full compatibility with Shrine theme loader and authentication

### Security

- **Shrine Auth Preserved**: No changes to Shrine authentication or loader functionality
- **Safe Fallbacks**: Implemented secure translation fallbacks to prevent content exposure

## v1.0.0-i18n-rtl

### Added

- Full Arabic & Hebrew RTL support
- Self-hosted PlexArabic + Heebo fonts (locale-scoped, zero EN impact)
- .rtl-num helper for stock messages
- Conditional preloads & lang CSS
- Playwright tests for i18n, UI RTL, stock messages, and font loading
- Lighthouse CI thresholds applied

## [1.0.0] - 2024-XX-XX

### Added

- Initial theme structure
- Hero value proposition section
- Social proof components
- Theme settings schema
- Development environment setup

### Changed

### Deprecated

### Removed

### Fixed

### Security

---

## Version History

### v1.0.0 - Initial Release

- **Date**: TBD
- **Features**:
  - Basic theme structure
  - Hero section with value proposition
  - Social proof elements
  - Mobile-responsive design
  - Theme customization options

### v0.1.0 - Development Setup

- **Date**: 2024-09-06
- **Features**:
  - Git Flow implementation
  - Shopify CLI integration
  - Code quality tools (Prettier, Husky)
  - Pre-commit hooks
  - Documentation structure
