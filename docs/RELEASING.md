# Releasing @leadpixel/maxoptra

This project uses a fully automated **Continuous Deployment (CD)** pipeline.

## 1. Verification (PR Phase)
Every Pull Request must pass the `Verify PR` workflow, which runs:
- Formatting checks (`biome format`)
- Linting (`biome check`)
- Type checking (`tsc`)
- Unit tests (`vitest run tests/unit`)

## 2. Deployment (Merge to Main)
When a PR is merged into the `main` branch, the `Deploy to Main` workflow is triggered:
1. **E2E Validation:** Runs the full test suite (including E2E tests against the mock server).
2. **Auto-Versioning:** Automatically bumps the version (`patch`), synchronises `deno.json`, and creates a Git tag.
3. **Publishing:** Automatically publishes the new version to **npm**.

## 3. Manual Releases (Optional)
If you need to perform a **major** or **minor** release (not just a patch), you should run `npm version [major|minor]` locally and push the tags. The automation is designed to handle automated patches for standard merges.

```bash
# Example for a manual minor release:
npm version minor
git push origin main --tags
```

---

## Prerequisites for Automation
- `NPM_TOKEN` must be set in GitHub Actions secrets.
- `GITHUB_TOKEN` must have "Read and write permissions" (default in many setups).
