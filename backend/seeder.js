const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@vibestore.com',
    password: 'password123',
    isAdmin: true,
  }
];

const products = [
  // Electronics (6)
  {
    name: 'Wireless Noise-Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and Hi-Res Audio certification. Experience studio-quality sound anywhere.',
    brand: 'Sony',
    category: 'Electronics',
    price: 299.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 124,
    sold: 850
  },
  {
    name: 'Smart Home Speaker V2',
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=800&auto=format&fit=crop',
    description: 'Voice-controlled smart speaker with rich bass, smart home integration, and multi-room audio. Compatible with all major platforms.',
    brand: 'Amazon',
    category: 'Electronics',
    price: 99.99,
    countInStock: 50,
    rating: 4.6,
    numReviews: 210,
    sold: 1200
  },
  {
    name: '4K Ultra HD Smart TV 55"',
    image: 'https://www.compraderas.com.bo/wp-content/uploads/2017/09/lg_tv_smart_55uj6580_uhd.jpg',
    description: 'Stunning 55-inch 4K OLED TV with Dolby Vision, HDR10+, and smart streaming capabilities. Transform your living room.',
    brand: 'LG',
    category: 'Electronics',
    price: 799.99,
    countInStock: 8,
    rating: 4.9,
    numReviews: 312,
    sold: 540
  },
  {
    name: 'Mechanical Gaming Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
    description: 'RGB mechanical keyboard with Cherry MX switches, N-key rollover, and aluminum frame for professional gaming.',
    brand: 'Corsair',
    category: 'Electronics',
    price: 149.99,
    countInStock: 30,
    rating: 4.7,
    numReviews: 189,
    sold: 670
  },
  {
    name: 'True Wireless Earbuds Pro',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=800&auto=format&fit=crop',
    description: 'Crystal-clear sound with adaptive noise cancellation, 8-hour battery, and IPX5 water resistance. Built for life on the move.',
    brand: 'Apple',
    category: 'Electronics',
    price: 249.99,
    countInStock: 25,
    rating: 4.8,
    numReviews: 456,
    sold: 1890
  },
  {
    name: 'Portable Bluetooth Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop',
    description: '360° surround sound, 24-hour playtime, IP67 waterproof rating. The ultimate outdoor audio companion.',
    brand: 'JBL',
    category: 'Electronics',
    price: 89.99,
    countInStock: 45,
    rating: 4.5,
    numReviews: 328,
    sold: 1100
  },
  // Fashion (5)
  {
    name: 'Classic Leather Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    description: 'Elegant timepiece with genuine Italian leather strap, sapphire crystal glass, and minimalist Swiss movement dial.',
    brand: 'Daniel Wellington',
    category: 'Fashion',
    price: 159.00,
    countInStock: 10,
    rating: 4.5,
    numReviews: 89,
    sold: 340
  },
  {
    name: 'Premium Cotton T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    description: 'Ultra-soft, breathable 100% organic cotton t-shirt. Tailored fit, pre-shrunk, and available in 12 curated colors.',
    brand: 'Vibe Basics',
    category: 'Fashion',
    price: 29.99,
    countInStock: 100,
    rating: 4.7,
    numReviews: 312,
    sold: 2100
  },
  {
    name: 'Slim Fit Denim Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop',
    description: 'Premium selvedge denim with a modern slim fit. Crafted for comfort and durability that improves with every wash.',
    brand: "Levi's",
    category: 'Fashion',
    price: 79.99,
    countInStock: 40,
    rating: 4.6,
    numReviews: 215,
    sold: 780
  },
  {
    name: 'Wool Blend Overcoat',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop',
    description: 'Sophisticated wool-blend overcoat with a tailored silhouette. Perfect for formal and smart-casual occasions.',
    brand: 'Zara',
    category: 'Fashion',
    price: 189.00,
    countInStock: 12,
    rating: 4.4,
    numReviews: 76,
    sold: 210
  },
  {
    name: 'Silk Evening Dress',
    image: 'https://www.bing.com/images/search?view=detailV2&ccid=7kIqsi7N&id=49AAEF0A7AEBA0E386E2938E12A39F9D0A30165B&thid=OIP.7kIqsi7NWfLmlNoy_5u-wgHaLH&mediaurl=https%3a%2f%2ftrendaura.co.uk%2fcdn%2fshop%2ffiles%2fdressnavy.jpg%3fv%3d1763246062%26width%3d1445&exph=900&expw=600&q=silk+evening+dress+for+women&FORM=IRPRST&ck=C89890AED75221C638340B0205934401&selectedIndex=4&itb=0',
    description: 'Luxurious silk evening dress with fluid draping and elegant minimalist design. Perfect for special occasions.',
    brand: 'H&M Studio',
    category: 'Fashion',
    price: 129.00,
    countInStock: 18,
    rating: 4.8,
    numReviews: 94,
    sold: 290
  },
  // Shoes (4)
  {
    name: 'Minimalist White Sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    description: 'Clean, versatile white leather sneakers with premium cushioning. The iconic silhouette that goes with everything.',
    brand: 'Nike',
    category: 'Shoes',
    price: 89.50,
    countInStock: 25,
    rating: 4.4,
    numReviews: 145,
    sold: 920
  },
  {
    name: 'Running Performance Shoes',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
    description: 'Lightweight running shoes with Boost™ midsole technology, Primeknit upper, and Continental rubber outsole.',
    brand: 'Adidas',
    category: 'Shoes',
    price: 129.99,
    countInStock: 30,
    rating: 4.8,
    numReviews: 402,
    sold: 1500
  },
  {
    name: 'Classic Chelsea Boots',
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800&auto=format&fit=crop',
    description: 'Genuine leather Chelsea boots with elastic side panels and a stacked heel. Timeless style meets modern comfort.',
    brand: 'Clarks',
    category: 'Shoes',
    price: 149.00,
    countInStock: 20,
    rating: 4.6,
    numReviews: 112,
    sold: 430
  },
  {
    name: 'Sport Sandals',
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800&auto=format&fit=crop',
    description: 'Ergonomically designed sport sandals with adjustable straps, EVA footbed, and durable rubber outsole.',
    brand: 'Birkenstock',
    category: 'Shoes',
    price: 69.99,
    countInStock: 35,
    rating: 4.5,
    numReviews: 198,
    sold: 760
  },
  // Kids (3)
  {
    name: 'Kids Educational Building Blocks',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop',
    description: 'Colorful STEM building blocks set designed to boost creativity and motor skills. Safe, non-toxic, and BPA-free.',
    brand: 'Lego',
    category: 'Kids',
    price: 45.00,
    countInStock: 40,
    rating: 4.9,
    numReviews: 230,
    sold: 1100
  },
  {
    name: 'put the ',
    image: 'https://i5.walmartimages.com/seo/Caroma-Electric-Scooter-for-Kids-Ages-6-14-120W-150W-Motor-10-mph-Adjustable-Speed-Height-Colorful-Lights-Dark-Blue_a432d594-e77b-4863-8741-e9ed8f9bb918.837d58bd16cb519d3ec88b88c15bd442.jpeg',
    description: 'Safe, foldable electric scooter for kids aged 6-12. 3 speed modes, LED lights, and 10km battery range.',
    brand: 'Razor',
    category: 'Kids',
    price: 189.99,
    countInStock: 15,
    rating: 4.7,
    numReviews: 87,
    sold: 350
  },
  {
    name: "Children's Backpack Set",
    image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=800&auto=format&fit=crop',
    description: 'Ergonomic school backpack set with padded straps, multiple compartments, and reflective safety strips. Ages 5-12.',
    brand: 'Skip Hop',
    category: 'Kids',
    price: 39.99,
    countInStock: 55,
    rating: 4.6,
    numReviews: 142,
    sold: 680
  },
  // Arts (4)
  {
    name: 'Professional Watercolor Paint Set',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
    description: 'Professional-grade 24-color watercolor set with artist-quality pigments, excellent lightfastness, and vibrant hues.',
    brand: 'Winsor & Newton',
    category: 'Arts',
    price: 55.99,
    countInStock: 15,
    rating: 4.7,
    numReviews: 88,
    sold: 450
  },
  {
    name: 'Artist Sketch Pad Bundle',
    image: 'https://images.unsplash.com/photo-1456518563096-0ff5ee08204e?q=80&w=800&auto=format&fit=crop',
    description: 'Complete sketching bundle with 5 premium sketch pads (A3, A4), 30 graphite pencils, charcoal sticks, and erasers.',
    brand: 'Faber-Castell',
    category: 'Arts',
    price: 34.99,
    countInStock: 25,
    rating: 4.8,
    numReviews: 167,
    sold: 820
  },
  {
    name: 'Premium Acrylic Paint Set',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800&auto=format&fit=crop',
    description: 'Heavy-body acrylic paint set with 48 vibrant colors. Ideal for canvas, wood, fabric, and mixed media projects.',
    brand: 'Golden',
    category: 'Arts',
    price: 79.99,
    countInStock: 20,
    rating: 4.9,
    numReviews: 203,
    sold: 610
  },
  {
    name: 'Digital Drawing Tablet',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
    description: 'Professional graphics tablet with 8192 pressure levels, tilt recognition, and battery-free stylus. Works with all major apps.',
    brand: 'Wacom',
    category: 'Arts',
    price: 249.99,
    countInStock: 10,
    rating: 4.8,
    numReviews: 156,
    sold: 390
  }
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }));

    await Product.insertMany(sampleProducts);

    console.log('✅ Data Imported Successfully! Total products:', sampleProducts.length);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
