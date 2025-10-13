'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, ChefHat, Leaf, Wheat } from 'lucide-react'
import { MenuCategoryHeading, RestaurantSubsectionHeading } from '@/components/ui/SmartHeadings'

interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  category: string
  dietary?: string[]
  chefRecommendation?: boolean
}

interface MenuCategory {
  id: string
  name: string
  description: string
  items: MenuItem[]
}

const menuCategories: MenuCategory[] = [
  {
    id: 'appetizers',
    name: 'Appetizers',
    description: 'Begin your culinary journey',
    items: [
      {
        id: 'amuse-bouche',
        name: 'Amuse-Bouche Selection',
        description: 'Chef\'s daily creation of three delicate bites',
        price: '€18',
        category: 'appetizers',
        chefRecommendation: true
      },
      {
        id: 'tartare',
        name: 'Atlantic Tuna Tartare',
        description: 'Fresh tuna with avocado, citrus, and sesame oil',
        price: '€22',
        category: 'appetizers'
      },
      {
        id: 'foie-gras',
        name: 'Pan-Seared Foie Gras',
        description: 'With fig compote and brioche toast',
        price: '€24',
        category: 'appetizers',
        dietary: ['rich']
      }
    ]
  },
  {
    id: 'mains',
    name: 'Main Courses',
    description: 'Signature creations',
    items: [
      {
        id: 'beef-tenderloin',
        name: 'Beef Tenderloin Rossini',
        description: 'With truffle sauce, foie gras, and seasonal vegetables',
        price: '€48',
        category: 'mains',
        chefRecommendation: true
      },
      {
        id: 'sea-bass',
        name: 'Mediterranean Sea Bass',
        description: 'With saffron risotto and fennel confit',
        price: '€38',
        category: 'mains',
        dietary: ['gluten-free']
      },
      {
        id: 'lobster',
        name: 'Butter-Poached Lobster',
        description: 'With vanilla-infused vegetables and coral sauce',
        price: '€58',
        category: 'mains',
        chefRecommendation: true
      },
      {
        id: 'vegetarian',
        name: 'Wild Mushroom Risotto',
        description: 'With truffle oil and aged parmesan',
        price: '€28',
        category: 'mains',
        dietary: ['vegetarian']
      }
    ]
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet conclusions',
    items: [
      {
        id: 'souffle',
        name: 'Grand Marnier Soufflé',
        description: 'Light and airy citrus soufflé with crème anglaise',
        price: '€16',
        category: 'desserts',
        chefRecommendation: true
      },
      {
        id: 'chocolate',
        name: 'Chocolate Artistry',
        description: 'Dark chocolate mousse with hazelnut crunch',
        price: '€14',
        category: 'desserts',
        dietary: ['vegetarian']
      },
      {
        id: 'cheesecake',
        name: 'Belgian Cheesecake',
        description: 'With berry compote and basil ice cream',
        price: '€15',
        category: 'desserts',
        dietary: ['vegetarian']
      }
    ]
  }
]

const dietaryIcons: Record<string, React.ReactElement> = {
  vegetarian: <Leaf className="w-4 h-4" />,
  glutenFree: <Wheat className="w-4 h-4" />,
  rich: <ChefHat className="w-4 h-4" />
}

export default function LuxuryMenu() {
  const [selectedCategory, setSelectedCategory] = useState(menuCategories[0].id)

  const currentCategory = menuCategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="heading-serif-large text-[3.5rem] md:text-[4rem] text-black leading-[0.9] tracking-[-0.015em] mb-4">Our Menu</h1>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent mx-auto mb-8" />
        <p className="text-[1.3rem] text-gray-600 leading-relaxed font-luxury max-w-3xl mx-auto">
          A culinary journey crafted with passion, using the finest ingredients and innovative techniques
        </p>
      </motion.div>

      {/* Category Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex justify-center mb-12"
      >
        <div className="flex space-x-1 bg-gray-50 p-1 rounded-full">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-8 py-3 rounded-full transition-all duration-300 font-luxury font-medium tracking-wide ${
                selectedCategory === category.id
                  ? 'bg-white text-burgundy shadow-md'
                  : 'text-gray-600 hover:text-burgundy'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Category Content */}
      {currentCategory && (
        <motion.div
          key={currentCategory.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* Category Header */}
          <div className="text-center mb-12">
            <MenuCategoryHeading>{currentCategory.name}</MenuCategoryHeading>
            <p className="text-gray-600">{currentCategory.description}</p>
          </div>

          {/* Menu Items Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {currentCategory.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-white border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:border-burgundy/20">
                  {/* Chef's Recommendation Badge */}
                  {item.chefRecommendation && (
                    <div className="absolute top-4 right-4 bg-burgundy text-white px-3 py-1 rounded-full text-xs font-luxury font-medium flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Chef&apos;s Choice</span>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <RestaurantSubsectionHeading className="text-rich-black mb-2 flex items-center">
                        {item.name}
                        {item.dietary && item.dietary.map((diet, idx) => (
                          <span key={idx} className="ml-2 text-burgundy/60" title={diet}>
                            {dietaryIcons[diet] || <Leaf className="w-4 h-4" />}
                          </span>
                        ))}
                      </h3>
                      <p className="text-[1.3rem] text-gray-600 leading-relaxed font-luxury mb-3">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <span className="text-suisse-h4 text-burgundy">
                        {item.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-burgundy to-transparent" />
                    <button className="text-sm font-luxury text-burgundy hover:text-rich-black transition-colors duration-300">
                      Add to Order
                    </button>
                    <div className="w-12 h-px bg-gradient-to-r from-burgundy to-transparent" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Menu Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-center mt-16 p-8 bg-ivory/50 rounded-lg"
      >
        <h3 className="text-suisse-h3 mb-4">A Note from Our Chef</h3>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Our menu changes seasonally to showcase the finest local ingredients. We accommodate dietary restrictions with advance notice.
          Please inform us of any allergies when making your reservation.
        </p>
        <div className="mt-6 flex justify-center items-center space-x-2 text-sm text-gray-500">
          <ChefHat className="w-4 h-4" />
          <span className="font-luxury">All dishes are prepared to order</span>
        </div>
      </motion.div>
    </div>
  )
}