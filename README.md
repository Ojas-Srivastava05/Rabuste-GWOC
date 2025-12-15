# ☕ RABUSTE - Premium Coffee Brand

A modern coffee brand website with an elegant animated intro experience.

---

## 🚀 Getting Started

Follow these steps to set up the project on your local machine.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** or **pnpm**
- **Git**

Check your Node version:
```bash
node --version
```

---

## 📦 Installation Steps

### 1. Clone the Repository

```bash
git clone (https://github.com/Ojas-Srivastava05/Rabuste-GWOC.git)
cd Rabuste
```

### 2. Navigate to Frontend Directory

```bash
cd rabuste-frontend
```

### 3. Install Dependencies

Choose one of the following:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using pnpm:**
```bash
pnpm install
```

This will install all required dependencies including:
- Next.js 15
- React 19
- Framer Motion
- Tailwind CSS
- TypeScript

### 4. Run Development Server

```bash
npm run dev
```

Or with yarn/pnpm:
```bash
yarn dev
# or
pnpm dev
```

### 5. Open in Browser

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📁 Project Structure

```
Rabuste/
├── rabuste-frontend/          # Main Next.js application
│   ├── app/                   # App directory (Next.js 14+)
│   │   ├── page.tsx          # Home page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   └── SVGIntro.tsx     # Animated intro component
│   ├── public/              # Static assets
│   │   └── logo.svg        # Brand logo
│   └── package.json        # Dependencies
└── README.md               # This file
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🎨 Key Features

- **Animated Intro** - Elegant coffee cup drawing and filling animation
- **Responsive Design** - Works on all devices
- **Modern Stack** - Built with Next.js 15 and React 19
- **TypeScript** - Type-safe codebase
- **Framer Motion** - Smooth animations

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in `rabuste-frontend/` if needed:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your-api-url
```

### Customization

- **Logo**: Replace `/public/logo.svg` with your logo
- **Colors**: Modify Tailwind theme in `tailwind.config.ts`
- **Intro Animation**: Edit `components/SVGIntro.tsx`

---

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

### Clear Cache

```bash
rm -rf .next
rm -rf node_modules
npm install
```

### Module Not Found

```bash
npm install
```

---

## 👥 Team Workflow

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   ```

4. **Push changes**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request** on GitHub

---

## 📞 Support

If you encounter any issues:

1. Check this README
2. Clear cache and reinstall dependencies
3. Contact the team lead

---

## 📄 License

Copyright © 2024 RABUSTE. All rights reserved.
