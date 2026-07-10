import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const CategoryPage = () => {
  const { name } = useParams();
  const { data: products, isLoading, error } = useGetProductsQuery();

  const hiddenProductNames = ['4K Ultra HD Smart TV 55"', 'Silk Evening Dress', 'Kids Electric Scooter'];
  const categoryProducts = products?.filter(
    (p) =>
      p.category.toLowerCase() === name.toLowerCase() &&
      Boolean(p?.image) &&
      !hiddenProductNames.includes(p.name)
  );

  return (
    <div className="py-8 min-h-[70vh]">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-primary-color capitalize mb-2">{name} Collection</h1>
        <p className="text-muted-color">Explore the best products in {name}.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>
      ) : error ? (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20">{error?.data?.message || 'Error fetching products'}</div>
      ) : categoryProducts?.length === 0 ? (
        <div className="neumorph p-12 text-center rounded-3xl">
          <h2 className="text-2xl font-bold text-secondary-color mb-4">No products found in this category.</h2>
          <Link to="/" className="text-accent hover:underline">Go back home</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryProducts.map((product) => (
            <div key={product._id} className="skeuomorph-card rounded-3xl overflow-hidden group flex flex-col">
              <div className="relative h-64 overflow-hidden p-4 pb-0">
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <Link to={`/product/${product._id}`} className="mb-2">
                  <h3 className="text-lg font-bold text-primary-color line-clamp-2 hover:text-accent transition-colors">{product.name}</h3>
                </Link>
                
                <div className="flex items-center gap-4 mb-5 mt-auto pt-4 border-t border-current">
                  <div className="flex items-center gap-1.5">
                    <Star className="text-yellow-500 fill-yellow-500" size={16} />
                    <span className="text-sm font-bold text-secondary-color">{product.rating}</span>
                  </div>
                  <div className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                    🔥 {product.sold} Sold
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-black text-primary-color">₹{product.price.toFixed(2)}</span>
                  <Link to={`/product/${product._id}`} className="neumorph-btn px-4 py-2 rounded-xl text-accent font-bold text-sm">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
