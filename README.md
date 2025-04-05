# GitHub Profile Analyzer

A modern web application that visualizes GitHub user profiles and their activity metrics. Built with React, TypeScript, and ShadcnUI.

![GitHub Profile Analyzer](screenshot.png)

## Features

- 🔍 **User Search**: Easily search for any GitHub user
- 📊 **Contribution Graph**: Visual representation of user's contribution history
- 📚 **Repository List**: Display user's public repositories with detailed information
- 🌓 **Dark/Light Mode**: Toggle between dark and light themes
- 🎯 **Interactive UI**: Smooth animations and hover effects
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **React**: Frontend framework
- **TypeScript**: Type-safe development
- **ShadcnUI**: Modern UI components
- **Tailwind CSS**: Styling and responsive design
- **Framer Motion**: Smooth animations
- **GitHub API**: Data fetching

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- GitHub Personal Access Token

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/github-profile-analyzer.git
cd github-profile-analyzer
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your GitHub token:

```env
VITE_GITHUB_TOKEN=your_github_token_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Getting a GitHub Token

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `read:user`
   - `repo`
4. Copy the generated token and add it to your `.env` file

## Environment Setup

1. Create a GitHub Personal Access Token:

   - Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a descriptive name (e.g., "GitHub Profile Analyzer Local")
   - Select these scopes:
     - `read:user`
     - `repo`
   - Set an expiration date (recommended: 30 days)
   - Copy your token (you won't see it again!)

2. Set up environment variables:

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your token
   # Replace 'your_github_token_here' with your actual token
   ```

⚠️ IMPORTANT: Security Notes

- NEVER commit your `.env` file
- NEVER share your token with anyone
- If you accidentally expose your token:
  1. Immediately go to GitHub and revoke it
  2. Generate a new token
  3. Update your local `.env` file

## Usage

1. Enter a GitHub username in the search field
2. Click the search button or press Enter
3. View the user's:
   - Contribution history graph
   - List of public repositories
   - Repository details including:
     - Language used
     - Star count
     - Description

## Features in Detail

### Contribution Graph

- Shows a full year of contribution history
- Color-coded squares represent contribution intensity
- Hover over squares to see detailed information
- Interactive animations on hover

### Repository Cards

- Clean, modern design
- Shows repository name, description, and stats
- Links directly to GitHub repositories
- Smooth hover animations
- Responsive grid layout

### Theme Switching

- Toggle between light and dark modes
- Persists user preference
- Smooth transition animations
- Matches GitHub's color scheme

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- GitHub API for providing the data
- ShadcnUI for the beautiful components
- The React community for amazing tools and libraries
