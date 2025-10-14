# Bleeps and Bloops

A modern web showcase featuring games, tools, and experiments built with Next.js 15, TypeScript, and Tailwind CSS v4.

## 🎮 What's Inside

This project is a collection of interactive experiences organized into three main categories:

- **Games** - Classic and modern web games
- **Tools** - Useful utilities and converters
- **Experiments** - Creative coding projects and demos

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Development**: Turbopack for fast builds

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd bleeps-and-bloops-com
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── games/[slug]/      # Individual game pages
│   ├── tools/[slug]/      # Individual tool pages
│   ├── experiments/[slug]/ # Individual experiment pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
│   └── games/            # Game-specific components
│       ├── game-container.tsx
│       ├── pong/         # Pong game implementation
│       └── chess-locator/ # Chess locator game
└── data.ts               # Sample data for games, tools, and experiments
```

## 🎯 Current Features

### Games

- **Pong** - Classic arcade game built with GitHub Copilot
- **Memory Match** - Card matching memory game
- **Snake Game** - Classic snake gameplay

### Tools

- **Color Picker** - Generate and explore color palettes
- **JSON Formatter** - Format and validate JSON data
- **Base64 Encoder** - Encode and decode Base64 strings

### Experiments

- **Particle System** - Interactive particle physics
- **Wave Generator** - Create mesmerizing wave patterns
- **Fractal Explorer** - Explore mathematical fractals

## 🎨 Design System

The project uses a consistent design system with:

- Custom fonts: Orbitron (headings), Space Grotesk (body), Space Mono (mono)
- Color scheme with CSS custom properties
- Dark/light mode support
- Responsive design patterns

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Development Guidelines

- Use TypeScript for all new files
- Follow the established component patterns
- Keep components small and focused
- Use Tailwind CSS classes for styling
- Implement proper TypeScript interfaces
- Support both light and dark themes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
