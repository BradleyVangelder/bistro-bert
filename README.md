# Bistro Bert - Luxury Fine Dining Website

A sophisticated, luxury restaurant website inspired by high-end hotel aesthetics like Design Hotels. Built with Next.js, TypeScript, and Tailwind CSS.

## Design Philosophy

This website has been completely redesigned to embody luxury hotel aesthetics with:

- **Sophisticated Color Palette**: Warm neutrals (ivory, cream, warm white) with rich accents (forest green, warm gold)
- **Elegant Typography**: Playfair Display for headlines, Fraunces for display text, and Inter for body copy
- **Minimalist Layout**: Generous white space, asymmetrical compositions, and refined spacing
- **Subtle Interactions**: Smooth animations, hover effects, and thoughtful micro-interactions
- **Luxury Components**: Custom-styled cards, buttons, and navigation elements

## Key Features

- Full-bleed hero sections with cinematic imagery
- Smooth scroll navigation with active section tracking
- Responsive design that maintains elegance across all devices
- Integrated PDF menu viewer with luxury styling
- Reservation form with elegant design
- Mobile-optimized navigation

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Homepage with luxury design
│   ├── menu/page.tsx     # Menu page with PDF viewer
│   ├── contact/page.tsx  # Redirects to homepage contact section
│   ├── layout.tsx        # Root layout with font imports
│   └── globals.css       # Luxury styling system
├── components/
└── public/
    └── images/            # Image assets
```

## Design System

### Colors
- Primary: Forest Green (#2C5F4C)
- Secondary: Warm Gold (#D4AF37)
- Neutrals: Warm White (#FFFEF9), Cream (#F8F6F3), Ivory (#FFFFF0)

### Typography
- Display: Fraunces (bold, dramatic headlines)
- Headings: Playfair Display (elegant serif)
- Body: Inter (clean sans-serif)

### Components
- `.luxury-card` - Elevated card design
- `.btn-luxury` - Sophisticated button with hover animation
- `.luxury-link` - Underline link effect
- `.text-display` - Large display typography
- `.container-luxury` - Max-width container with padding

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
