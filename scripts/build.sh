#!/bin/bash

set -euo pipefail

APP_NAME="mitre-app-for-splunk"
DRY_RUN=0

show_help() {
    cat << EOF
Usage:
  $(basename "$0") [OPTIONS] VERSION [SOURCE_DIR]

Create a .tgz archive with a predefined naming format:
  ${APP_NAME}_<version>.tgz

OPTIONS:
  -h, --help        Show this help message and exit
  -n, --dry-run     Show which files would be archived without creating the archive

ARGUMENTS:
  VERSION           Version number (examples: 1, 10, 2024, 1.0.0, 2.1.3)
  SOURCE_DIR        Directory to archive (default: current directory)

EXCLUSIONS:
  - scripts/ directory
  - .git/ directory
  - All .git* files
  - .DS_Store files
  - local/ directories
  - local.meta files

EXAMPLES:
  ./$(basename "$0") 100
  ./$(basename "$0") 213 /opt/project
  ./$(basename "$0") --dry-run 300 ../my-project

OUTPUT:
  ${APP_NAME}_<version>.tgz

EOF
}

error() {
    echo "Error: $1" >&2
    exit 1
}

validate_version() {
    local version="$1"

    if ! [[ "$version" =~ ^[0-9]+([.][0-9]+)*$ ]]; then
        error "VERSION must be numeric or dot-separated numeric (examples: 1, 10, 2024, 1.0.0)"
    fi
}

check_git_clean() {
    local source_dir="$1"

    if [[ -d "$source_dir/.git" ]] && command -v git >/dev/null 2>&1; then
        if ! git -C "$source_dir" diff --quiet || ! git -C "$source_dir" diff --cached --quiet; then
            error "Git working directory is not clean. Commit or stash your changes first."
        fi
    fi
}

build_excludes() {
    EXCLUDES=(
        "--exclude=scripts"
        "--exclude=scripts/*"
        "--exclude=*/scripts"
        "--exclude=*/scripts/*"

        "--exclude=.git"
        "--exclude=.git/*"
        "--exclude=.git*"

        "--exclude=.DS_Store"
        "--exclude=*/.DS_Store"

        "--exclude=local"
        "--exclude=local/*"
        "--exclude=*/local"
        "--exclude=*/local/*"

        "--exclude=local.meta"
        "--exclude=*/local.meta"

        "--exclude=$OUTPUT_FILE"
    )
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                show_help
                exit 0
                ;;
            -n|--dry-run)
                DRY_RUN=1
                shift
                ;;
            -*)
                error "Unknown option: $1"
                ;;
            *)
                break
                ;;
        esac
    done

    VERSION="${1:-}"
    SOURCE_DIR="${2:-.}"

    [[ -n "$VERSION" ]] || error "VERSION is required. Run with --help for usage."
}

parse_args "$@"
validate_version "$VERSION"

[[ -d "$SOURCE_DIR" ]] || error "Source directory does not exist: $SOURCE_DIR"

SOURCE_DIR="$(cd "$SOURCE_DIR" && pwd)"
SOURCE_BASENAME="$(basename "$SOURCE_DIR")"
SOURCE_PARENT="$(dirname "$SOURCE_DIR")"

OUTPUT_FILE="${APP_NAME}_${VERSION}.tgz"
OUTPUT_PATH="$(pwd)/$OUTPUT_FILE"

check_git_clean "$SOURCE_DIR"
build_excludes

echo "Preparing archive..."
echo "Version     : $VERSION"
echo "Source      : $SOURCE_DIR"
echo "Output file : $OUTPUT_PATH"

if [[ "$DRY_RUN" -eq 1 ]]; then
    echo
    echo "Dry run mode: listing files that would be included in the archive"
    gtar -czf /dev/null \
        "${EXCLUDES[@]}" \
        -C "$SOURCE_PARENT" "$SOURCE_BASENAME" \
        -v
    exit 0
fi

gtar -czf "$OUTPUT_PATH" \
    "${EXCLUDES[@]}" \
    -C "$SOURCE_PARENT" "$SOURCE_BASENAME"

echo "Archive created successfully: $OUTPUT_PATH"
