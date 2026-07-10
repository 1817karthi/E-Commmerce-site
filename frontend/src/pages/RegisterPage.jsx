import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, User, ShoppingCart } from 'lucide-react';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrMsg('');
    if (password !== confirmPassword) {
      setErrMsg('Passwords do not match.');
      return;
    }
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      setErrMsg(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="skeuomorph-card rounded-[2.5rem] p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="neumorph-btn p-4 rounded-2xl text-primary mb-4">
              <ShoppingCart size={32} />
            </div>
            <h1 className="text-3xl font-black text-primary-color">Create Account</h1>
            <p className="text-muted-color mt-2">Join the VibeStore community today</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-secondary-color mb-2">Full Name</label>
              <div className="neumorph-inset rounded-2xl flex items-center px-5 py-4 gap-3">
                <User size={20} className="text-primary shrink-0" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="bg-transparent outline-none text-primary-color placeholder-gray-500 w-full text-base"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-secondary-color mb-2">Email Address</label>
              <div className="neumorph-inset rounded-2xl flex items-center px-5 py-4 gap-3">
                <Mail size={20} className="text-primary shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-transparent outline-none text-primary-color placeholder-gray-500 w-full text-base"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-secondary-color mb-2">Password</label>
              <div className="neumorph-inset rounded-2xl flex items-center px-5 py-4 gap-3">
                <Lock size={20} className="text-primary shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  className="bg-transparent outline-none text-primary-color placeholder-gray-500 w-full text-base"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-secondary-color hover:text-accent transition shrink-0">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-secondary-color mb-2">Confirm Password</label>
              <div className="neumorph-inset rounded-2xl flex items-center px-5 py-4 gap-3">
                <Lock size={20} className="text-primary shrink-0" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="bg-transparent outline-none text-primary-color placeholder-gray-500 w-full text-base"
                />
              </div>
            </div>

            {/* Error */}
            {errMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                {errMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl font-black text-lg btn-accent transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-color">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-bold hover:text-accent-dark transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
