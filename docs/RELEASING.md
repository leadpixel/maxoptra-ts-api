# Releasing @leadpixel/maxoptra

This project uses an automated "Push-to-Publish" pattern via GitHub Actions.

## 1. Prerequisites
- Ensure you have the `NPM_TOKEN` secret configured in your GitHub repository.
- Your local `main` branch should be up to date.

## 2. Release Command
To trigger a release, use the `npm version` command. This will:
1. Run pre-release checks.
2. Bump the version in `package.json`.
3. Synchronise the version in `deno.json`.
4. Create a Git commit and a tag (e.g., `v1.0.1`).

```bash
# Choose the appropriate bump:
npm version patch # 1.0.0 -> 1.0.1
npm version minor # 1.0.0 -> 1.1.0
npm version major # 1.0.0 -> 2.0.0
```

## 3. Push to GitHub
Push the new commit and the tag to GitHub.

```bash
git push origin main --tags
```

## 4. Automatic Publishing
Once the tag is pushed:
1. **GitHub Actions** will trigger the `Publish to NPM` workflow.
2. The workflow runs the full suite of linting, building, and testing.
3. If all checks pass, it will automatically publish the package to npm.

You can monitor the progress in the **Actions** tab of your GitHub repository.
