# 🌿 LeafWise - AI-Powered Plant Identification

A modern, intuitive web application that helps you identify plants and learn how to care for them using the power of Google's Gemini AI.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📸 **Plant Identification** - Snap a photo or upload an image to identify any plant
- 🤖 **AI-Powered Analysis** - Powered by Google Gemini for accurate identification and care tips
- 📚 **Detailed Information** - Get comprehensive plant care guides, toxicity info, and fun facts
- 💾 **Scan History** - Keep track of all your identified plants
- ⭐ **Favorites** - Build your personal plant collection
- 🌱 **Discover Plants** - Explore a curated collection of beautiful plants
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern UI/UX** - Gradient headers, smooth animations, and card hover effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zayn-Qureshi/Leaf_Wise
   cd Leaf_Wise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
npm start
```

## � Deploy to Vercel

The easiest way to deploy LeafWise is using [Vercel](https://vercel.com):

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Zayn-Qureshi/Leaf_Wise)

### Manual Deployment

1. **Push your code to GitHub** (if not already done)
   
2. **Sign up/Login to [Vercel](https://vercel.com)**
   
3. **Import your repository**
   - Click "Add New" → "Project"
   - Select your `Leaf_Wise` repository
   
4. **Configure environment variables**
   - Add `GOOGLE_API_KEY` with your Gemini API key
   
5. **Deploy!**
   - Vercel will automatically detect Next.js settings
   - Your app will be live in minutes

> **Important**: Don't forget to add your `GOOGLE_API_KEY` in Vercel's Environment Variables settings!

## �🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **AI**: [Google Genkit](https://github.com/firebase/genkit) with Gemini AI
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Form Validation**: [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/)

## 📁 Project Structure

```
Leaf_Wise/
├── src/
│   ├── ai/                  # Genkit AI flows and configurations
│   │   ├── flows/           # AI flow definitions
│   │   └── genkit.ts        # Genkit setup
│   ├── app/                 # Next.js app router pages
│   │   ├── discover/        # Discover plants page
│   │   ├── history/         # Scan history page
│   │   ├── my-plants/       # Favorite plants page
│   │   ├── plant/[id]/      # Individual plant details
│   │   ├── settings/        # Settings page
│   │   ├── globals.css      # Global styles
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   │   ├── discover/        # Discover page components
│   │   ├── history/         # History page components
│   │   ├── home/            # Home page components
│   │   ├── layout/          # Layout components
│   │   ├── my-plants/       # My plants page components
│   │   ├── plant/           # Plant details components
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and types
│   │   ├── actions.ts       # Server actions
│   │   ├── constants.ts     # App constants
│   │   ├── types.ts         # TypeScript types
│   │   └── utils.ts         # Helper functions
├── public/                  # Static assets
├── .env                     # Environment variables (create this)
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json             # Dependencies and scripts
```

## 🎨 Features in Detail

### Plant Identification
- Upload images or take photos directly
- Automatic image compression for faster processing
- AI-powered identification using Google Gemini
- Confidence scores and alternative suggestions

### Comprehensive Plant Information
- Common and scientific names
- Plant type and growth habit
- Origin and flowering period
- Toxicity information
- Detailed care instructions
- Propagation tips
- Fun facts about each plant

### History Management
- View all previously identified plants
- Search and filter your history
- Delete unwanted scans
- Favorite plants for quick access

### My Plants Collection
- Personal collection of favorite plants
- Add plants manually
- Set watering reminders
- Add personal notes

## 🔧 Configuration

### Performance Optimizations

The app includes several performance optimizations:
- Image compression (max 1024px, 80% JPEG quality)
- SWC minification
- Optimized package imports
- Smooth CSS transitions
- Font smoothing

### Customization

You can customize the app's appearance in `src/app/globals.css`:
- Color scheme (primary, accent, etc.)
- Gradient styles
- Animation timings
- Typography

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run genkit:dev   # Start Genkit development UI
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) for the AI model
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Vercel](https://vercel.com) for hosting and deployment
- [Lucide](https://lucide.dev/) for beautiful icons

## 📧 Contact

Your Name - [@ZaynQureshi14](https://x.com/ZaynQureshi14)

Project Link: [https://github.com/yourusername/Leaf_Wise](https://github.com/yourusername/Leaf_Wise)

---

<p align="center">Made By Muhammad Zain 🌱</p>
