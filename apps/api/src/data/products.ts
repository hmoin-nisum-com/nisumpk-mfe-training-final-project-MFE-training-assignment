import { Product } from '@ecommerce/shared-types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_01',
    name: 'Aura Pro Wireless ANC Headphones',
    description: 'Studio-grade spatial audio with active noise cancellation and 40-hour ultra battery life.',
    price: 299.99,
    category: 'Audio',
    rating: 4.9,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    badge: 'Best Seller',
    featured: true
  },
  {
    id: 'prod_02',
    name: 'Apex Horizon Ultra Smartwatch',
    description: 'Titanium chassis with sapphire crystal display, ECG monitoring, and multi-band GPS.',
    price: 399.0,
    category: 'Wearables',
    rating: 4.8,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    badge: 'New Release',
    featured: true
  },
  {
    id: 'prod_03',
    name: 'Nexus Key Precision Mechanical Keyboard',
    description: 'Hot-swappable tactile switches, gasket mount design, and custom RGB per-key illumination.',
    price: 149.5,
    category: 'Electronics',
    rating: 4.7,
    stock: 38,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    badge: 'Popular',
    featured: false
  },
  {
    id: 'prod_04',
    name: 'Lumix Beam 4K Studio Webcam',
    description: 'High dynamic range Sony STARVIS sensor with dual beamforming microphones and privacy shutter.',
    price: 189.99,
    category: 'Electronics',
    rating: 4.6,
    stock: 19,
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80',
    featured: false
  },
  {
    id: 'prod_05',
    name: 'PulseFlow True Wireless Earbuds',
    description: 'Compact IPX7 waterproof earbuds with transparency mode and low-latency gaming profile.',
    price: 119.0,
    category: 'Audio',
    rating: 4.5,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    badge: 'Top Value',
    featured: false
  },
  {
    id: 'prod_06',
    name: 'Vanguard Aerograde Aluminum Laptop Stand',
    description: 'Ergonomic 360-degree rotating base crafted from anodized aircraft aluminum for optimal thermals.',
    price: 64.99,
    category: 'Accessories',
    rating: 4.9,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    featured: false
  }
];
