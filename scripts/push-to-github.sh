#!/usr/bin/env bash
# ==============================================================================
# QuantOS ACTI — GitHub Open Source Push Helper Script
# ==============================================================================
# Usage:
#   ./scripts/push-to-github.sh <REMOTE_URL>
#
# Examples:
#   ./scripts/push-to-github.sh https://github.com/myusername/QuantOS-ACTI.git
#   ./scripts/push-to-github.sh git@github.com:myusername/QuantOS-ACTI.git
# ==============================================================================

set -e

REMOTE_URL="$1"

echo "======================================================================"
echo "  QuantOS ACTI — Preparing and Pushing to GitHub"
echo "======================================================================"

# Check if a git remote is provided or already configured
if [ -z "$REMOTE_URL" ]; then
    EXISTING_REMOTE=$(git remote get-url origin 2>/dev/null || true)
    if [ -n "$EXISTING_REMOTE" ]; then
        REMOTE_URL="$EXISTING_REMOTE"
        echo "Using existing remote origin: $REMOTE_URL"
    else
        echo "Error: No remote repository URL provided."
        echo "Usage: ./scripts/push-to-github.sh https://github.com/<YOUR_USER>/QuantOS-ACTI.git"
        exit 1
    fi
else
    # Set or update origin remote
    if git remote | grep -q "^origin$"; then
        echo "Updating existing remote 'origin' to: $REMOTE_URL"
        git remote set-url origin "$REMOTE_URL"
    else
        echo "Adding remote 'origin': $REMOTE_URL"
        git remote add origin "$REMOTE_URL"
    fi
fi

# Ensure branch is main
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
fi

# Stage any uncommitted files
if [ -n "$(git status --porcelain)" ]; then
    echo "Staging recent changes..."
    git add .
    git commit -m "chore: prepare repository files for open-source release" || true
fi

echo "Pushing main branch to $REMOTE_URL..."
git push -u origin main

echo ""
echo "======================================================================"
echo "  SUCCESS! QuantOS ACTI has been pushed to GitHub."
echo "  Repository: $REMOTE_URL"
echo "======================================================================"
