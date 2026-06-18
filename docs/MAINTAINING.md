# How to Maintain

## Code Quality

### Linting and Formatting

#### Running Linter

```bash
# Run ESLint on the entire codebase
npm run lint

# Fix linting issues automatically (if supported)
npm run lint -- --fix
```

#### Code Formatting

```bash
# Format code with Prettier
npx prettier --write "src/"

# Check formatting without writing
npx prettier --check "src/"
```

### CYSCOM Content Quality

- Review all cybersecurity resources for accuracy
- Ensure tutorials and guides are up-to-date
- Verify all links and external resources work correctly
- Check for any outdated security information or practices

### TypeScript

#### Type Checking

```bash
# Check TypeScript types
npx tsc --noEmit

# With watch mode
npx tsc --watch
```

## Version Management

### Updating Dependencies

#### Update npm packages

```bash
# Update all dependencies to latest versions
npm update

# Update specific package
npm update <package-name>

# Check for outdated packages
npm outdated
```

#### Security Updates

```bash
# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix
```

## Build and Deployment

### Building for Production

```bash
# Clean build
rm -rf dist
npm run build

# Production build with analysis
npm run build -- --analyze
```

### Deployment Checklist

- [ ] Run linter: `npm run lint`
- [ ] Check TypeScript types: `npx tsc --noEmit`
- [ ] Run tests (if available)
- [ ] Build for production: `npm run build`
- [ ] Verify build output
- [ ] Update version in package.json if needed
- [ ] Commit changes

## Git Operations

### Branch Management

```bash
# Create and switch to a new feature branch
git checkout -b feature/your-feature-name

# Update branch with latest changes
git pull origin main

# Merge a feature branch
# From main branch
git merge feature/your-feature-name

# Delete a feature branch after merging
git branch -d feature/your-feature-name
git push --delete origin feature/your-feature-name
```

### Commit Conventions

Follow conventional commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
```

### Example Commits

```bash
git add .
git commit -m "feat: add animated hero section"
git commit -m "fix: resolve navigation menu issue" -m "Fixed mobile menu toggle"
git commit -m "docs: update README with development setup"
```

## Project Maintenance Scripts

### Custom Scripts

Add these scripts to package.json for easier maintenance:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write src/",
  "format:check": "prettier --check src/",
  "typecheck": "tsc --noEmit",
  "typecheck:watch": "tsc --watch",
  "clean": "rm -rf dist node_modules .vite",
  "preinstall": "npx only-allow npm"
}
```

## Monitoring and Maintenance

### Performance Monitoring

- Use browser dev tools for performance analysis
- Monitor bundle size in production builds
- Check for unused dependencies with `npm ls --depth=0`

### Dependency Updates

```bash
# Check for outdated dependencies weekly
npm outdated

# Update dependencies monthly
npm update

# Review changes before updating
npm outdated | grep -E "^(package|dependencies)"
```

## Backup and Recovery

### Local Backup

```bash
# Backup source code
git clone <repository-url> backup
cd backup

# Backup build artifacts
mkdir -p backup-build
cp -r dist backup-build/
```

### Recovery from Issues

```bash
# Reset to last commit (discard changes)
git reset --hard HEAD

# Revert to specific commit
git checkout <commit-hash>

# Restore specific file
git checkout HEAD -- path/to/file
```
