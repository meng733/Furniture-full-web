const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve static assets/uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Root path handler
app.get('/', (req, res) => {
  res.send('Novus Luxury Furniture API is running...');
});

// Seed Initial Data (Helper function execution)
const seedDatabase = async () => {
  try {
    const User = require('./models/User');
    const Category = require('./models/Category');
    const Product = require('./models/Product');

    // 1. Seed Admin User
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const bcrypt = require('bcryptjs');
      // Create admin user manually to bypass double-hashing (save hook does it anyway)
      await User.create({
        name: 'Novus Admin',
        email: 'admin@novus.com',
        password: 'adminpassword123',
        role: 'admin'
      });
      console.log('✅ Default admin account seeded: admin@novus.com / adminpassword123');
    }

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const categoriesData = [
        {
          name: 'Sofas',
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          description: 'Luxurious modern sofas and sectionals'
        },
        {
          name: 'Beds',
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
          description: 'Elegant custom design beds for restful sleep'
        },
        {
          name: 'Dining Tables',
          image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
          description: 'Contemporary dining tables and comfortable chairs'
        },
        {
          name: 'Office Furniture',
          image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
          description: 'Ergonomic office tables, storage cabinets, and desks'
        },
        {
          name: 'TV Stands',
          image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
          description: 'Modern sleek entertainment centers and media consoles'
        },
        {
          name: 'Kitchen Cabinets',
          image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
          description: 'Custom luxury modular kitchen setups'
        }
      ];
      await Category.insertMany(categoriesData);
      console.log('✅ Sample categories seeded successfully.');
    }

    // 3. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const productsData = [
        {
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
      await Product.insertMany(productsData);
      console.log('✅ Sample products seeded successfully.');
    }
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  }
};

// Execute seeding logic
seedDatabase();

// Mount Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
