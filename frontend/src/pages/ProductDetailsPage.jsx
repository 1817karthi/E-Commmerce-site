import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ShoppingCart, TrendingUp } from 'lucide-react';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';

const ProductDetailsPage = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  return (
    <div className="py-8">
      <Link to="/" className="neumorph-btn px-4 py-2 rounded-xl inline-flex items-center gap-2 mb-8 text-secondary-color hover:text-accent transition-colors font-medium">
        <ArrowLeft size={20} /> Go Back
      </Link>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20">{error?.data?.message || 'Error fetching product'}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image - Skeuomorphic presentation */}
          <div className="skeuomorph-card p-6 rounded-[2.5rem]">
            <div className="rounded-[2rem] overflow-hidden relative shadow-2xl">
              <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
              <div className="absolute top-4 right-4 glassmorphism px-4 py-2 rounded-full font-bold text-primary-color tracking-wide shadow-lg">
                {product.category}
              </div>
            </div>
          </div>

          {/* Product Info - Neumorphic panels */}
          <div className="space-y-8">
            <div className="neumorph p-8 rounded-3xl">
              <h1 className="text-3xl md:text-4xl font-black text-primary-color mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-current">
                <div className="flex items-center gap-1.5">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  <span className="font-bold text-lg text-secondary-color">{product.rating}</span>
                  <span className="text-muted-color">({product.numReviews} Reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-lg font-bold">
                  <TrendingUp size={18} /> {product.sold} Units Sold
                </div>
              </div>
              <p className="text-muted-color leading-relaxed text-lg mb-8">
                {product.description}
              </p>
              <div className="text-4xl font-black text-primary-color">
                ₹{product.price.toFixed(2)}
              </div>
            </div>

            <div className="neumorph p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-current">
                <span className="text-secondary-color font-semibold text-lg">Status:</span>
                <span className={`font-bold text-lg ${product.countInStock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-current">
                  <span className="text-secondary-color font-semibold text-lg">Quantity:</span>
                  <select 
                    value={qty} 
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="neumorph-inset bg-transparent outline-none px-4 py-2 rounded-xl text-primary-color font-bold cursor-pointer"
                  >
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1} className="bg-surface text-primary-color">
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button 
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                  product.countInStock === 0 
                  ? 'bg-surface text-muted-color cursor-not-allowed' 
                  : 'btn-accent'
                }`}
              >
                <ShoppingCart size={24} /> Add To Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
