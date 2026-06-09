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

# Clean build artifacts
clean:
    rm -rf dist
