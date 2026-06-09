# Releasing @leadpixel/maxoptra

This project follows a "Build -> Verify -> Tag -> Publish" deployment pattern.

## 1. Local Preparation
Ensure your local environment is clean and up to date.

```bash
# Get latest changes
git checkout main
git pull origin main

# Install fresh dependencies
pnpm install
```

## 2. Automated Quality Check
Before bumping the version, ensure everything is perfect.

```bash
# Run lint, format, type-check, and all tests (including mocked E2E)
just lint
just test
```

## 3. Version Bump
Use `npm version` to update `package.json` and create a git tag. Use [Semantic Versioning](https://semver.org/).

```bash
# Choose one:
npm version patch # Bug fixes (1.0.0 -> 1.0.1)
npm version minor # New features (1.0.0 -> 1.1.0)
npm version major # Breaking changes (1.0.0 -> 2.0.0)
```

**Note:** After running this, manually update the `version` in `deno.json` to match.

## 4. Final Build
Generate the distribution files that will actually be uploaded to npm.

```bash
just clean
just build
```

## 5. Publishing
Push your changes and publish the package.

```bash
# Push the commit and the new tag
git push origin main --tags

# Publish to npm
npm publish --access public
```

---

## Automated Deployment (Future)
Once a release tag is pushed, the GitHub Action can be extended to automatically publish to npm. For now, the manual `npm publish` step ensures a "human-in-the-loop" safety check.
