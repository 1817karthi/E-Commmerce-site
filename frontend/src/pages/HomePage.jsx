import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Star, TrendingUp, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const defaultProductImage = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop';

const ProductCard = ({ product }) => (
  <div className="skeuomorph-card rounded-3xl overflow-hidden group flex flex-col h-full">
    <div className="relative h-56 overflow-hidden p-4 pb-0">
      <div className="w-full h-full rounded-2xl overflow-hidden">
        <img
          src={product.image || defaultProductImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-6 left-6 glassmorphism px-3 py-1.5 rounded-full text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
          {product.category}
        </div>
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <Link to={`/product/${product._id}`}>
        <h3 className="text-base font-bold mb-1 line-clamp-2 hover:text-accent transition" style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h3>
      </Link>
      <p className="text-xs font-medium mb-4" style={{ color: 'var(--text-muted)' }}>{product.brand}</p>

      {/* Analytics */}
      <div className="flex items-center gap-3 mb-5 pb-4 flex-wrap" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
        <div className="flex items-center gap-1">
          <Star className="fill-yellow-500 text-yellow-500" size={14} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{product.rating}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({product.numReviews})</span>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-lg text-green-400 bg-green-400/10">
          🔥 {product.sold?.toLocaleString()} Sold
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>₹{product.price.toFixed(2)}</span>
        <Link
          to={`/product/${product._id}`}
          className="neumorph-btn px-4 py-2 rounded-xl font-bold text-sm transition"
          style={{ color: 'var(--accent)' }}
        >
          View
        </Link>
      </div>
    </div>
  </div>
);

const hiddenProductNames = ['4K Ultra HD Smart TV 55"', 'Silk Evening Dress', 'Kids Electric Scooter'];

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get('search') || '';
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: products, isLoading, error } = useGetProductsQuery(searchKeyword ? `?keyword=${searchKeyword}` : '');
  const filteredProducts = useMemo(
    () =>
      (products || []).filter(
        (product) =>
          Boolean(product?.image?.toString().trim()) &&
          !hiddenProductNames.includes(product.name)
      ),
    [products]
  );
  const sliderProducts = filteredProducts;
  const activeProduct = sliderProducts[activeIndex] || sliderProducts[0] || null;

  useEffect(() => {
    if (!sliderProducts.length) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % sliderProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderProducts.length]);

  return (
    <div className="space-y-24">
      {/* Hero — only when not searching */}
      {!searchKeyword && (
        <section className="relative mt-8">
          <div className="neumorph relative overflow-hidden rounded-[3rem] border border-current" style={{ background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-base))' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 85% 20%, rgba(99,102,241,0.14), transparent 30%), radial-gradient(circle at 12% 80%, rgba(255,255,255,0.10), transparent 20%)' }} />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] items-center px-6 py-8 md:px-12 md:py-10">
              <div className="space-y-8">
                <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.32em] font-bold" style={{ color: 'var(--text-secondary)' }}>
                  {['Home', 'Man', 'Woman', 'Kids', 'Sale'].map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.45em] font-bold" style={{ color: 'var(--accent)' }}>
                    Exclusive drop
                  </p>
                  <h1 className="font-black text-5xl md:text-6xl lg:text-7xl leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {activeProduct?.name?.split(' ')[0] || 'Jump'}
                    <span className="block" style={{ color: 'var(--accent)' }}>
                      {activeProduct?.brand || 'Man'}
                    </span>
                  </h1>
                  <p className="uppercase text-xs tracking-[0.28em] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Basketball Shoe
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
                    ₹{activeProduct?.price?.toFixed(0) ?? '134'}
                  </span>
                  <span className="uppercase text-xs tracking-[0.35em] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {activeProduct?.category || 'Jordan Jumpman 2021 PF'}
                  </span>
                </div>

                <p className="max-w-xl leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {activeProduct?.description || 'Inspired by the latest Air Jordan game shoe, this design helps up-and-coming players level up their game.'}
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  {['#1f2937', '#4f46e5', '#ef4444', '#10b981'].map((color) => (
                    <span key={color} className="h-10 rounded-full border border-current" style={{ width: '3rem', backgroundColor: color }} />
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center min-h-[520px]">
                <div className="absolute inset-0 rounded-[2.5rem]" style={{ boxShadow: '0 30px 90px rgba(0,0,0,0.18)' }} />
                <div className="relative rounded-[2.5rem] bg-[rgba(255,255,255,0.04)] overflow-hidden flex items-center justify-center p-8" style={{ border: '1px solid var(--border)' }}>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-96 w-full">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
                    </div>
                  ) : activeProduct ? (
                    <img
                      src={activeProduct.image}
                      alt={activeProduct.name}
                      className="max-h-[520px] object-contain transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-96 w-full text-center" style={{ color: 'var(--text-secondary)' }}>
                      Product preview is not available
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
              {sliderProducts.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="rounded-full transition-all"
                  style={{
                    width: index === activeIndex ? 18 : 8,
                    height: index === activeIndex ? 18 : 8,
                    background: index === activeIndex ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Quick-Nav — only when not searching */}
      {!searchKeyword && (
        <section>
          <h2 className="text-3xl font-extrabold mb-10 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {['Electronics', 'Fashion', 'Kids', 'Shoes', 'Arts'].map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat.toLowerCase()}`}
                className="neumorph-btn h-36 rounded-3xl flex flex-col items-center justify-center gap-3 group"
              >
                <div
                  className="w-14 h-14 rounded-full neumorph-inset flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform duration-300"
                  style={{ color: 'var(--accent)' }}
                >
                  {cat.charAt(0)}
                </div>
                <span className="font-bold tracking-wide text-sm" style={{ color: 'var(--text-secondary)' }}>{cat}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section>
        <div className="flex items-center justify-between mb-10">
          {searchKeyword ? (
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <Search style={{ color: 'var(--accent)' }} size={30} />
              Results for "{searchKeyword}"
            </h2>
          ) : (
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              <TrendingUp style={{ color: 'var(--accent)' }} size={30} /> Top Sellers
            </h2>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
            {error?.data?.message || 'Error loading products. Is the backend running?'}
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="neumorph rounded-3xl p-16 text-center">
            <Search className="mx-auto mb-4" size={48} style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>No products found</h3>
            <Link to="/" className="font-semibold" style={{ color: 'var(--accent)' }}>Clear search</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
