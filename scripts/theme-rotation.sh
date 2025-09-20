#!/bin/bash
# Theme Rotation Strategy Script
# Usage: ./scripts/theme-rotation.sh [create|list|delete] [environment] [version]

set -euo pipefail

# Configuration
STORE="ncjbp3-cm.myshopify.com"
BASE_NAME="ondermax-shopify-theme"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get current git branch
get_current_branch() {
    git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main"
}

# Generate theme name
generate_theme_name() {
    local environment="$1"
    local version="$2"
    local branch=""
    
    if [[ "$environment" == "feature" ]]; then
        branch="$(get_current_branch | sed 's/[^a-zA-Z0-9-]/-/g')"
        echo "${BASE_NAME}-${environment}-${branch}-${version}"
    else
        echo "${BASE_NAME}-${environment}-${version}"
    fi
}

# List all themes
list_themes() {
    log_info "Listing all themes for store: ${STORE}"
    echo
    shopify theme list | grep -E "${BASE_NAME}" || log_warning "No themes found matching pattern"
}

# Create new theme
create_theme() {
    local environment="$1"
    local version="$2"
    local theme_name
    
    theme_name=$(generate_theme_name "$environment" "$version")
    
    log_info "Creating new theme: ${theme_name}"
    
    # Check if theme already exists
    if shopify theme list | grep -q "${theme_name}"; then
        log_error "Theme ${theme_name} already exists!"
        exit 1
    fi
    
    # Create theme by pushing current local files
    shopify theme push --theme "${theme_name}" --unpublished
    
    log_success "Theme created: ${theme_name}"
    log_info "You can now work on this theme safely without affecting production"
}

# Delete theme
delete_theme() {
    local environment="$1"
    local version="$2"
    local theme_name
    
    theme_name=$(generate_theme_name "$environment" "$version")
    
    log_warning "Are you sure you want to delete theme: ${theme_name}?"
    read -p "Type 'yes' to confirm: " confirmation
    
    if [[ "$confirmation" == "yes" ]]; then
        log_info "Deleting theme: ${theme_name}"
        shopify theme delete --theme "${theme_name}"
        log_success "Theme deleted: ${theme_name}"
    else
        log_info "Deletion cancelled"
    fi
}

# Show usage
show_usage() {
    echo "Theme Rotation Strategy Script"
    echo
    echo "Usage:"
    echo "  $0 list                                    # List all themes"
    echo "  $0 create <environment> <version>          # Create new theme"
    echo "  $0 delete <environment> <version>          # Delete theme"
    echo
    echo "Environments:"
    echo "  production    - Production theme"
    echo "  staging       - Staging theme"
    echo "  develop       - Development theme"
    echo "  feature       - Feature branch theme (uses current git branch)"
    echo
    echo "Examples:"
    echo "  $0 create staging v1.2.3"
    echo "  $0 create feature v1.2.4"
    echo "  $0 delete feature v1.2.4"
    echo
}

# Main script logic
main() {
    local action="${1:-}"
    local environment="${2:-}"
    local version="${3:-}"
    
    case "$action" in
        "list")
            list_themes
            ;;
        "create")
            if [[ -z "$environment" || -z "$version" ]]; then
                log_error "Environment and version are required for create action"
                show_usage
                exit 1
            fi
            create_theme "$environment" "$version"
            ;;
        "delete")
            if [[ -z "$environment" || -z "$version" ]]; then
                log_error "Environment and version are required for delete action"
                show_usage
                exit 1
            fi
            delete_theme "$environment" "$version"
            ;;
        *)
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
