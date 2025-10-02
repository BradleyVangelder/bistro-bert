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
    alt: 'Bistro Bert - Verfijnde sfeer en ambiance',
    priority: true
  },
  {
    id: 'chef-portrait',
    src: '/images/restaurant/chef-portrait.jpg',
    alt: 'Onze chef',
    priority: true
  },
  {
    id: 'cuisine-elegant',
    src: '/images/restaurant/cuisine.jpg',
    alt: 'Elegante gerechtpresentatie'
  },
  {
    id: 'dining-room',
    src: '/images/restaurant/dining-room.jpg',
    alt: 'Eetzaal sfeer'
  },
  {
    id: 'fine-dining',
    src: '/images/restaurant/hero-elegant-fine-dining.jpg',
    alt: 'Elegante fine dining ervaring',
    priority: true
  },
  {
    id: 'interior-luxury',
    src: '/images/restaurant/hero-upscale-interior.jpg',
    alt: 'Stijlvol interieur'
  },
  {
    id: 'ambiance',
    src: '/images/restaurant/ambiance.jpg',
    alt: 'Verfijnde tafeldekking'
  },
  {
    id: 'service',
    src: '/images/restaurant/service.jpg',
    alt: 'Professionele bediening'
  }
]