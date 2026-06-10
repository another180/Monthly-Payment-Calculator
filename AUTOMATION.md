# Automation Setup

## Available Commands

### Manual Automation
Run tests and build in sequence (build only runs if tests pass):
```bash
npm run test-and-build
```

### Continuous Integration (CI)
For local pre-commit hooks, install Husky:
```bash
npm install husky --save-dev
npx husky install
chmod +x .husky/pre-commit
```

After setup, tests will automatically run before each commit. If tests fail, the commit is blocked.

### GitHub Actions (CI/CD)
Automated testing and building on:
- Every push to `main` or `develop` branches
- Every pull request to `main` or `develop` branches
- Tests on Node.js 18.x and 20.x

View workflow status in GitHub Actions tab.

## How It Works

### test-and-build Script
1. Runs `npm test`
2. If tests pass, runs `npm run build`
3. If tests fail, build is skipped and process exits with error

### GitHub Actions Workflow (.github/workflows/ci.yml)
- Triggered on push/PR to main/develop
- Installs dependencies with `npm ci`
- Runs full test suite
- Builds production bundle
- Tests on multiple Node versions for compatibility

### Pre-commit Hook (.husky/pre-commit)
- Automatically runs before each git commit
- Prevents commits if tests fail
- Can be bypassed with `git commit --no-verify` if needed

## Monitoring

- **Local**: Watch for test/build results in terminal
- **Git commits**: Pre-commit hook will block commits with failing tests
- **GitHub**: View CI status in pull requests and Actions tab
