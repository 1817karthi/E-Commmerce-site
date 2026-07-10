import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { addToCart, removeFromCart, clearCartItems } from '../slices/cartSlice';
import { useAddOrderMutation } from '../slices/ordersApiSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [addOrder, { isLoading: isCreatingOrder }] = useAddOrderMutation();

  const updateQty = (item, qty) => {
    if (qty < 1) return;
    dispatch(addToCart({ ...item, qty }));
  };

  const removeHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) return;

    const orderPayload = {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      })),
      shippingAddress: shippingAddress?.address
        ? shippingAddress
        : {
            address: 'N/A',
            city: 'N/A',
            postalCode: 'N/A',
            country: 'N/A',
          },
      paymentMethod: paymentMethod || 'Stripe',
      itemsPrice: Number(itemsPrice || 0),
      taxPrice: Number(taxPrice || 0),
      shippingPrice: Number(shippingPrice || 0),
      totalPrice: Number(totalPrice || 0),
    };

    try {
      const createdOrder = await addOrder(orderPayload).unwrap();
      dispatch(clearCartItems());
      navigate(`/order-success/${createdOrder._id}`);
    } catch (error) {
      console.error('Order creation failed:', error);
      navigate('/order-success');
    }
  };

  return (
    <div className="py-8 min-h-[70vh]">
      <h1 className="text-4xl font-extrabold text-primary-color mb-10 flex items-center gap-3">
        <ShoppingBag className="text-primary" size={36} /> Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="neumorph rounded-3xl p-16 text-center">
          <ShoppingBag className="mx-auto text-secondary-color mb-6" size={64} />
          <h2 className="text-2xl font-bold text-secondary-color mb-4">Your cart is empty</h2>
          <p className="text-muted-color mb-8">Looks like you haven't added any items yet.</p>
          <Link to="/" className="inline-flex items-center gap-2 btn-accent font-bold py-4 px-8 rounded-2xl transition-all transform hover:-translate-y-0.5">
            <ArrowLeft size={20} /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="skeuomorph-card rounded-3xl p-6 flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 neumorph-inset">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-grow min-w-0">
                  <Link to={`/product/${item._id}`} className="text-lg font-bold text-primary-color hover:text-accent transition line-clamp-2">{item.name}</Link>
                  <p className="text-primary-color font-black text-xl mt-1">₹{item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => updateQty(item, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="neumorph-btn w-9 h-9 rounded-xl flex items-center justify-center text-secondary-color hover:text-accent transition disabled:opacity-30"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-black text-primary-color text-lg">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item, item.qty + 1)}
                    disabled={item.qty >= item.countInStock}
                    className="neumorph-btn w-9 h-9 rounded-xl flex items-center justify-center text-secondary-color hover:text-accent transition disabled:opacity-30"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="font-black text-xl shrink-0 w-20 text-right text-primary-color">₹{(item.price * item.qty).toFixed(2)}</p>

                <button onClick={() => removeHandler(item._id)} className="neumorph-btn w-10 h-10 rounded-xl flex items-center justify-center text-secondary-color hover:text-red-400 transition shrink-0">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="skeuomorph-card rounded-3xl p-8 sticky top-28">
              <h2 className="text-2xl font-black text-primary-color mb-8 pb-6 border-b border-current">Order Summary</h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-current">
                <div className="flex justify-between text-secondary-color">
                  <span>Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)</span>
                  <span className="font-semibold text-primary-color">₹{Number(itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary-color">
                  <span>Shipping</span>
                  <span className={`font-semibold ${Number(shippingPrice) === 0 ? 'text-green-400' : 'text-primary-color'}`}>
                    {Number(shippingPrice) === 0 ? 'FREE' : `₹${Number(shippingPrice).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-secondary-color">
                  <span>Tax (15%)</span>
                  <span className="font-semibold text-primary-color">₹{Number(taxPrice || 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between mb-8">
                <span className="text-xl font-black text-primary-color">Total</span>
                <span className="text-2xl font-black text-primary-color">₹{Number(totalPrice || 0).toFixed(2)}</span>
              </div>
              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0 || isCreatingOrder}
                className="w-full py-5 rounded-2xl font-black text-lg btn-accent transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isCreatingOrder ? 'Processing Order...' : 'Proceed to Checkout'} <ArrowRight size={20} />
              </button>
              <Link to="/" className="block text-center text-secondary-color hover:text-accent mt-4 font-medium transition">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
