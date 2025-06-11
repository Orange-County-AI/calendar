#!/bin/bash

# Post-create script for OCAI Calendar dev container
set -e

echo "🚀 Setting up OCAI Calendar development environment..."

# Install project dependencies
echo "📦 Installing dependencies with Bun..."
bun install

# Verify installation
echo "✅ Verifying installation..."
echo "Node.js version: $(node --version)"
echo "Bun version: $(bun --version)"
echo "Wrangler version: $(wrangler --version)"

# Set up git safe directory (in case of permission issues)
git config --global --add safe.directory /workspaces/ocai-calendar

echo "🎉 Development environment setup complete!"
echo ""
echo "Available commands:"
echo "  bun run dev     - Start development server"
echo "  bun run build   - Build for production"
echo "  bun run deploy  - Deploy to Cloudflare Workers"
echo "  bun run check   - Run type checking and linting"