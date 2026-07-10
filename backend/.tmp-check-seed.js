const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const Product = require('./models/Product');

connectDB().then(async () => {
  const names = ['4K Ultra HD Smart TV 55"', 'Silk Evening Dress', 'Kids Electric Scooter'];
  const products = await Product.find({ name: { $in: names } }, { name: 1, image: 1 }).lean();
  console.log(JSON.stringify(products, null, 2));
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
