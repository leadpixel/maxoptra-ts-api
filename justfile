set dotenv-load

[private]
default:
    @just --list

# Build the project
build:
    pnpm run build

# Lint the project
lint:
    pnpm run lint

# Format the project
format:
    pnpm run format

# Run tests
test:
    pnpm run test

# Run all pre-release checks
[private]
pre-release: lint build test
    @echo "✅ Pre-release checks passed."

# Clean build artifacts
clean:
    rm -rf dist

# Start an interactive Node.js REPL with the Maxoptra client pre-loaded
repl:
    pnpm exec tsx scripts/repl.ts
