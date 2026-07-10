import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Download, Copy, MessageCircle, Package } from 'lucide-react';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetOrderByIdQuery } from '../slices/ordersApiSlice';

const OrderSuccessPage = () => {
  const { id: orderId } = useParams();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { data: products = [] } = useGetProductsQuery();
  const {
    data: order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useGetOrderByIdQuery(orderId, { skip: !orderId });

  const orderDetails = order || {
    orderItems: cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    _id: orderId || `TEMP-${Math.floor(Math.random() * 900000) + 100000}`,
    createdAt: new Date().toISOString(),
  };

  const orderNumber = orderDetails._id ? orderDetails._id : `ORD-${Math.floor(Math.random() * 900000) + 100000}`;
  const hiddenProductNames = ['4K Ultra HD Smart TV 55"', 'Silk Evening Dress', 'Kids Electric Scooter'];
  const recommended = products
    .filter((product) => Boolean(product?.image) && !hiddenProductNames.includes(product.name))
    .slice(0, 4);

  const copyOrderId = async () => {
    await navigator.clipboard.writeText(orderNumber);
  };

  const downloadInvoice = () => {
    const invoiceLines = [
      `Order Invoice: ${orderNumber}`,
      `Date: ${new Date(orderDetails.createdAt).toLocaleString()}`,
      `Payment Method: ${orderDetails.paymentMethod || 'Stripe'}`,
      '',
      'Shipping Address:',
      `  ${orderDetails.shippingAddress?.address || 'N/A'}`,
      `  ${orderDetails.shippingAddress?.city || 'N/A'}, ${orderDetails.shippingAddress?.postalCode || 'N/A'}`,
      `  ${orderDetails.shippingAddress?.country || 'N/A'}`,
      '',
      'Items:',
      ...orderDetails.orderItems.map((item) =>
        `  - ${item.name} x${item.qty} @ ₹${item.price.toFixed(2)} = ₹${(item.qty * item.price).toFixed(2)}`
      ),
      '',
      `Subtotal: ₹${Number(orderDetails.itemsPrice || 0).toFixed(2)}`,
      `Shipping: ₹${Number(orderDetails.shippingPrice || 0).toFixed(2)}`,
      `Tax: ₹${Number(orderDetails.taxPrice || 0).toFixed(2)}`,
      `Total: ₹${Number(orderDetails.totalPrice || 0).toFixed(2)}`,
      '',
      'Thank you for your purchase!',
    ];

    const blob = new Blob([invoiceLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `invoice-${orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  if (isOrderLoading) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-secondary-color">Loading your order details...</p>
      </div>
    );
  }

  if (orderError) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-red-400">Unable to load the order. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-[80vh] space-y-10">
      <div className="skeuomorph-card rounded-[2rem] p-10">
        <div className="flex flex-col items-center gap-4 text-center mb-10">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 text-green-400 shadow-sm">
            <CheckCircle2 size={48} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-primary-color">Order Confirmed!</h1>
            <p className="text-muted-color mt-2">Your purchase is on its way. Thank you for shopping with us.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="neumorph rounded-3xl p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-secondary-color mb-2">Order Number</p>
                  <p className="text-xl font-black text-primary-color">{orderNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={copyOrderId}
                  className="neumorph-btn rounded-2xl px-4 py-3 text-secondary-color hover:text-accent transition"
                >
                  <Copy size={18} /> Copy
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.35em] text-secondary-color">Payment Method</p>
                  <p className="text-primary-color font-semibold">{orderDetails.paymentMethod || 'Stripe'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.35em] text-secondary-color">Delivery Estimate</p>
                  <p className="text-primary-color font-semibold">2-4 business days</p>
                </div>
              </div>
            </div>

            <div className="neumorph rounded-3xl p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-secondary-color mb-4">Shipping Address</p>
              {orderDetails.shippingAddress?.address ? (
                <div className="space-y-1 text-primary-color">
                  <p>{orderDetails.shippingAddress.address}</p>
                  <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}</p>
                  <p>{orderDetails.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-muted-color">No shipping address available.</p>
              )}
            </div>

            <div className="neumorph rounded-3xl p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-secondary-color mb-4">Order Summary</p>
              <div className="space-y-3">
                <div className="flex justify-between text-secondary-color">
                  <span>Items</span>
                  <span>₹{Number(orderDetails.itemsPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary-color">
                  <span>Shipping</span>
                  <span>₹{Number(orderDetails.shippingPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary-color">
                  <span>Tax</span>
                  <span>₹{Number(orderDetails.taxPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primary-color font-black text-lg pt-3 border-t border-current">
                  <span>Total</span>
                  <span>₹{Number(orderDetails.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link to="/" className="btn-accent text-center py-4 rounded-2xl">Continue Shopping</Link>
              <Link to="/profile" className="neumorph-btn text-center py-4 rounded-2xl text-primary font-bold">View Orders</Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="neumorph rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-primary-color">Need Help?</h2>
                <MessageCircle className="text-accent" size={24} />
              </div>
              <p className="text-muted-color mb-4">If you have any questions about your order, our support team is here to help.</p>
              <Link to="/contact" className="btn-accent inline-flex items-center gap-2 py-3 px-4 rounded-2xl">
                <MessageCircle size={18} /> Contact Support
              </Link>
            </div>

            <div className="neumorph rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-primary-color">Download Invoice</h2>
                <Download className="text-accent" size={24} />
              </div>
              <p className="text-muted-color mb-4">Grab a receipt for your records.</p>
              <button
                type="button"
                onClick={downloadInvoice}
                className="btn-accent w-full py-3 rounded-2xl inline-flex items-center justify-center gap-2"
              >
                <Download size={18} /> Download Invoice
              </button>
            </div>

            <div className="neumorph rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-primary-color">You may also like</h2>
                <Package className="text-accent" size={24} />
              </div>
              <div className="grid gap-4">
                {recommended.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group rounded-3xl border border-current p-4 hover:border-accent transition"
                  >
                    <div className="flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="h-16 w-16 rounded-2xl object-cover" />
                      <div>
                        <p className="font-bold text-primary-color line-clamp-1">{product.name}</p>
                        <p className="text-muted-color text-sm">₹{product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
