import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, LogOut } from 'lucide-react';
import { logout } from '../slices/authSlice';
import { useGetUserProfileQuery, useGetMyOrdersQuery } from '../slices/usersApiSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading: loadingOrders } = useGetMyOrdersQuery();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!userInfo) {
    navigate('/login');
    return null;
  }

  return (
    <div className="py-8 min-h-[70vh]">
      <h1 className="text-4xl font-extrabold text-primary-color mb-10">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="skeuomorph-card rounded-3xl p-8 flex flex-col items-center text-center">
            <div className="neumorph-btn w-24 h-24 rounded-full flex items-center justify-center mb-6 text-primary">
              <User size={48} />
            </div>
            <h2 className="text-2xl font-black text-primary-color mb-1">{userInfo.name}</h2>
            <p className="text-muted-color mb-2">{userInfo.email}</p>
            {userInfo.isAdmin && (
              <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30 mb-6">
                Admin
              </span>
            )}
            <div className="space-y-3 w-full mt-6 border-t border-current pt-6">
              {userInfo.isAdmin && (
                <Link to="/admin/dashboard" className="neumorph-btn w-full py-3 rounded-2xl font-bold text-primary flex items-center justify-center gap-2">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={logoutHandler}
                className="w-full py-3 rounded-2xl font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 flex items-center justify-center gap-2 transition"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2">
          <div className="skeuomorph-card rounded-3xl p-8">
            <h2 className="text-2xl font-black text-primary-color mb-8 pb-6 border-b border-current flex items-center gap-3">
              <Package className="text-primary" size={26} /> Order History
            </h2>
            {loadingOrders ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : orders?.length === 0 ? (
              <div className="text-center py-10">
                <Package className="mx-auto text-secondary-color mb-4" size={48} />
                <p className="text-muted-color font-medium">You haven't placed any orders yet.</p>
                <Link to="/" className="text-primary hover:underline mt-2 inline-block font-semibold">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <div key={order._id} className="neumorph rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-muted-color text-xs font-medium mb-1">Order ID</p>
                      <p className="text-primary-color font-mono font-bold text-sm">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-muted-color text-xs font-medium mb-1">Date</p>
                      <p className="text-primary-color font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-color text-xs font-medium mb-1">Total</p>
                      <p className="text-primary-color font-black text-lg">₹{order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${order.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                      </span>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${order.isDelivered ? 'bg-blue-500/20 text-blue-400' : 'bg-surface text-muted-color'}`}>
                        {order.isDelivered ? '📦 Delivered' : '🚚 Processing'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
