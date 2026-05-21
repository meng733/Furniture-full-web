export const mockCategories = [
  {
    _id: 'cat1',
    name: 'Sofas',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: 'Luxurious modern sofas and sectionals'
  },
  {
    _id: 'cat2',
    name: 'Beds',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    description: 'Elegant custom design beds for restful sleep'
  },
  {
    _id: 'cat3',
    name: 'Dining Tables',
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
    description: 'Contemporary dining tables and comfortable chairs'
  },
  {
    _id: 'cat4',
    name: 'Office Furniture',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    description: 'Ergonomic office tables, storage cabinets, and desks'
  },
  {
    _id: 'cat5',
    name: 'TV Stands',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    description: 'Modern sleek entertainment centers and media consoles'
  },
  {
    _id: 'cat6',
    name: 'Kitchen Cabinets',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    description: 'Custom luxury modular kitchen setups'
  }
];

export const mockProducts = [
  {
    _id: 'prod1',
    name: 'Velvet Cloud Sectional Sofa',
    price: 95000,
    description: 'A deep-seated, ultra-luxurious velvet sectional sofa designed for maximum comfort. Sturdy solid wood frame with premium padding and high-resiliency foam cushions.',
    category: 'Sofas',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 5,
    featured: true,
    ratings: 4.8,
    dimensions: '300cm W x 180cm D x 85cm H',
    materials: 'Solid Mahogany Frame, Premium Velvet Upholstery'
  },
  {
    _id: 'prod2',
    name: 'Nordic Oak Floating Bed Frame',
    price: 78000,
    description: 'Minimalist floating bed frame crafted from sustainably sourced oak wood. Features a sleek integrated headboard and ambient hidden LED light slots.',
    category: 'Beds',
    images: [
      'https://images.unsplash.com/photo-1505693395321-883724634266?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 3,
    featured: true,
    ratings: 4.9,
    dimensions: '210cm L x 190cm W x 95cm H',
    materials: 'Premium White Oak, Steel Braces'
  },
  {
    _id: 'prod3',
    name: 'Verona Walnut Dining Table Set',
    price: 110000,
    description: 'A masterpiece dining room set featuring a solid American walnut dining table and 6 upholstered mid-century chairs. Finished with food-safe natural oil.',
    category: 'Dining Tables',
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 4,
    featured: true,
    ratings: 4.7,
    dimensions: '220cm L x 100cm W x 75cm H',
    materials: 'American Walnut Wood, Premium Weave Fabric'
  },
  {
    _id: 'prod4',
    name: 'Stockholm Executive Walnut Desk',
    price: 54000,
    description: 'A premium L-shaped executive office desk. Offers spacious desktop workspace, cable management routes, and soft-closing file cabinets.',
    category: 'Office Furniture',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    featured: false,
    ratings: 4.5,
    dimensions: '180cm W x 140cm D x 76cm H',
    materials: 'Walnut Veneer, Matte Black Metal Legs'
  },
  {
    _id: 'prod5',
    name: 'Zenith Minimalist TV Stand Console',
    price: 38000,
    description: 'A wall-mounted floating TV stand with slatted oak cabinet doors and spacious compartments for media consoles.',
    category: 'TV Stands',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    featured: true,
    ratings: 4.6,
    dimensions: '200cm W x 40cm D x 35cm H',
    materials: 'Natural Oak Wood, MDF Core'
  },
  {
    _id: 'prod6',
    name: 'Imperial Modern Kitchen Cabinetry',
    price: 250000,
    description: 'Premium floor-to-ceiling modular kitchen cabinets with quartz countertops, soft-close Blum drawers, and integrated handleless profile.',
    category: 'Kitchen Cabinets',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 2,
    featured: true,
    ratings: 5.0,
    dimensions: 'Customized based on kitchen dimensions',
    materials: 'Waterproof Acrylic Boards, Quartz Stone'
  }
];

export const mockGallery = [
  {
    id: 1,
    title: 'Modern Living Room Addis Ababa',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    category: 'Living Room'
  },
  {
    id: 2,
    title: 'Custom Kitchen Installation Bole',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    category: 'Kitchen'
  },
  {
    id: 3,
    title: 'Luxury Bedroom Design Old Airport',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
    category: 'Bedroom'
  },
  {
    id: 4,
    title: 'Executive Office Setup Kazanchis',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    category: 'Office'
  },
  {
    id: 5,
    title: 'Cozy Accent Chair Corner',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80',
    category: 'Living Room'
  },
  {
    id: 6,
    title: 'Minimalist Dining Set Bole Atlas',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80',
    category: 'Dining Room'
  }
];
