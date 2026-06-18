# How to Run

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn (npm is recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cyscom-vit-chennai

# Install dependencies
npm install
# or
yarn install
```

### Running the Development Server

```bash
# Start the development server with hot module replacement
npm run dev
# or
yarn dev

# The server will start at http://localhost:3000
# Open your browser and navigate to http://localhost:3000
```

### Important Notes for CYSCOM

- This is the official website for CYSCOM (Cybersecurity Community of VIT Chennai)
- Ensure all cybersecurity content is accurate and up-to-date
- Review any changes to educational resources before deployment
- Check with the CYSCOM team for content updates

### Key Development Features

- **Hot Module Replacement (HMR)**: Changes are reflected instantly without page reload
- **TypeScript Support**: Full type checking during development
- **ESLint Integration**: Real-time linting in your editor
- **Tailwind CSS**: Utility-first styling with auto-completion

## Building for Production

```bash
# Build for production
npm run build

# The output will be in the dist/ directory
# This is optimized and ready for deployment
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview

# Useful for testing before deployment
```

## Deployment

### Common Deployment Platforms

#### Vercel
```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod
```

#### GitHub Pages
```bash
# Build the project
npm run build

# Deploy the dist/ folder to GitHub Pages
# Configure your repository's gh-pages branch
```

### CYSCOM Deployment Notes

- This website serves as the official CYSCOM platform
- Ensure all cybersecurity resources are verified before deployment
- Test all links and resources thoroughly
- Backup any existing content before making major changes

## Troubleshooting

### Common Issues

#### "npm: command not found"
```bash
# On Windows
# Install Node.js from https://nodejs.org/
# Restart your terminal

# On macOS with Homebrew
brew install node

# On Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm
```

#### "EACCES: permission denied"
```bash
# Run npm commands with sudo (not recommended)
# or configure npm permissions
npm config set prefix /usr/local
```

#### Port Already in Use
```bash
# Change the port in vite.config.js
# or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```
