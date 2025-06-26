# Portfolio Website

A modern, responsive portfolio website built with Next.js and Tailwind CSS.

## Features

- 🎨 Modern, clean design
- 📱 Fully responsive
- 🌙 Dark mode support
- ⚡ Fast and optimized
- 🎯 Smooth scrolling navigation

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Adding Your CV

1. Copy your CV PDF file to the `public` folder
2. Rename it to `cv.pdf` (or update the href in `src/app/page.tsx`)
3. Update the download filename in the "Download CV" button

### Personalizing Content

1. **Update personal information** in `src/app/page.tsx`:
   - Replace "Your Name" with your actual name
   - Update the profile picture initials (currently "YN")
   - Change the email address and social media links

2. **Add your projects**:
   - Replace the placeholder project cards with your real projects
   - Add actual project screenshots to the `public` folder
   - Update project descriptions and technology tags

3. **Customize colors**:
   - Modify the color scheme in `tailwind.config.js`
   - Update gradient colors in the components

## Deployment

This portfolio can be easily deployed to:
- [Vercel](https://vercel.com) (recommended for Next.js)
- [Netlify](https://netlify.com)
- Any other hosting platform

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint

## License

MIT
