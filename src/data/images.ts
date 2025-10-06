export interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
  priority?: boolean
}

export const galleryImages: GalleryImage[] = [
  // Feature Images
  {
    id: 'hero-feature',
    src: '/images/restaurant/hero-moody-wine-bar.jpg',
    alt: 'Menukaart — pagina 1',
    priority: true
  },
  {
    id: 'chef-portrait',
    src: '/images/restaurant/chef-portrait.jpg',
    alt: 'Menukaart — pagina 2',
    priority: true
  },
  {
    id: 'cuisine-elegant',
    src: '/images/restaurant/cuisine.jpg',
    alt: 'Menukaart — pagina 3'
  },
  {
    id: 'dining-room',
    src: '/images/restaurant/dining-room.jpg',
    alt: 'Menukaart — pagina 4'
  },
  {
    id: 'fine-dining',
    src: '/images/restaurant/hero-elegant-fine-dining.jpg',
    alt: 'Menukaart — pagina 5',
    priority: true
  },
  {
    id: 'interior-luxury',
    src: '/images/restaurant/hero-upscale-interior.jpg',
    alt: 'Menukaart — pagina 6'
  },
  {
    id: 'ambiance',
    src: '/images/restaurant/ambiance.jpg',
    alt: 'Menukaart — pagina 7'
  },
  {
    id: 'service',
    src: '/images/restaurant/service.jpg',
    alt: 'Menukaart — pagina 8'
  }
]