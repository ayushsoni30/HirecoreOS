/**
 * File: client/src/pages/AuthModal.jsx
 * Description: Scholarly editorial authentication modal for candidate registration, sign-in,
 *              and Google OAuth authentication with account linking.
 *              Compact, elegant layout with course selection, Cloudinary profile picture upload,
 *              Libertinus Serif typography, and sharp 0px corners.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../components/AuthContext';
import { useToast } from '../components/ToastContext';
import HcLogo from '../components/HcLogo';
import { User, Mail, Lock, BookOpen, Upload, Loader2, Sparkles, ShieldCheck, X } from 'lucide-react';

const COURSES = [
  'B.Tech',
  'B.A.',
  'B.C.A.',
  'B.Com',
  'B.Sc',
  'M.C.A.',
  'M.Tech',
  'M.Sc',
  'Other'
];

const AuthModal = () => {
  const { login, googleLogin, register, closeAuthModal } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('B.Tech');
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPEG, PNG, WEBP).', 'warning');
        return;
      }
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          showToast('Please enter both email and password.', 'warning');
          setLoading(false);
          return;
        }
        await login(email, password);
        showToast('Welcome back to HireCore OS!', 'success');
      } else {
        if (!name || !email || !password || !course) {
          showToast('Please fill in all required registration fields.', 'warning');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('course', course);
        if (profilePic) {
          formData.append('profilePic', profilePic);
        }

        await register(formData);
        showToast('Candidate account created successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || err.data?.message || 'Authentication error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    setLoading(true);
    try {
      await googleLogin(credentialResponse.credential);
      showToast('Successfully authenticated via Google!', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Google authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    showToast('Google Sign-In failed or was cancelled.', 'warning');
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-paper-950/90 backdrop-blur-sm select-none font-serif overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-[440px] border border-paper-800 bg-paper-900 text-paper-50 shadow-academic p-5 sm:p-6 space-y-4 text-left relative my-auto"
      >
        {/* Top Header Tag */}
        <div className="flex items-center justify-between border-b border-paper-800 pb-3">
          <div className="flex items-center gap-3">
            <HcLogo className="h-8 w-8 text-accent" />
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent block">
                [AUTH_GATEWAY]
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold tracking-tight text-paper-50 leading-tight">
                HireCore OS
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 border border-paper-700 bg-paper-950 font-mono text-[9px] text-paper-400 uppercase tracking-widest hidden sm:inline-block">
              FREE TIER
            </span>
            <button
              onClick={closeAuthModal}
              className="p-1 border border-paper-800 hover:border-paper-600 text-paper-400 hover:text-paper-100 transition-colors"
              title="Close Modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border border-paper-800 bg-paper-950">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 font-serif text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'login' 
                ? 'bg-accent/10 text-accent border-b-2 border-accent' 
                : 'text-paper-400 hover:text-paper-50'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 font-serif text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'register' 
                ? 'bg-accent/10 text-accent border-b-2 border-accent' 
                : 'text-paper-400 hover:text-paper-50'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              {/* Profile Pic Upload Frame */}
              <div className="flex items-center gap-3 p-2.5 border border-paper-800 bg-paper-950">
                <div className="w-11 h-11 border border-paper-700 bg-paper-900 flex items-center justify-center overflow-hidden shrink-0">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-paper-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-paper-400 block truncate">
                    Profile Picture (Cloudinary)
                  </span>
                  <label htmlFor="auth-pic" className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 border border-paper-700 bg-paper-900 hover:bg-paper-800 text-[10px] font-serif text-paper-200 transition-colors">
                    <Upload className="h-3 w-3 text-accent" />
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="auth-pic"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-paper-400 block">
                  Full Name
                </label>
                <div className="flex items-center border border-paper-800 bg-paper-950 px-2.5">
                  <User className="h-4 w-4 text-paper-500 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="Candidate Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2 px-2.5 bg-transparent text-paper-50 font-serif text-xs sm:text-sm focus:outline-none placeholder-paper-600"
                  />
                </div>
              </div>

              {/* Academic Course Selection */}
              <div className="space-y-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-paper-400 block">
                  Academic Course
                </label>
                <div className="flex items-center border border-paper-800 bg-paper-950 px-2.5">
                  <BookOpen className="h-4 w-4 text-paper-500 shrink-0" />
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full py-2 px-2.5 bg-paper-950 text-paper-50 font-serif text-xs sm:text-sm focus:outline-none cursor-pointer border-none"
                  >
                    {COURSES.map((c) => (
                      <option key={c} value={c} className="bg-paper-950 text-paper-50">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="font-mono text-[9px] uppercase tracking-widest text-paper-400 block">
              Email Address
            </label>
            <div className="flex items-center border border-paper-800 bg-paper-950 px-2.5">
              <Mail className="h-4 w-4 text-paper-500 shrink-0" />
              <input
                type="email"
                required
                placeholder="candidate@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 px-2.5 bg-transparent text-paper-50 font-serif text-xs sm:text-sm focus:outline-none placeholder-paper-600"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-mono text-[9px] uppercase tracking-widest text-paper-400 block">
              Password
            </label>
            <div className="flex items-center border border-paper-800 bg-paper-950 px-2.5">
              <Lock className="h-4 w-4 text-paper-500 shrink-0" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 px-2.5 bg-transparent text-paper-50 font-serif text-xs sm:text-sm focus:outline-none placeholder-paper-600"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 border border-accent bg-accent text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-accent/90 disabled:opacity-50 transition-colors mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : mode === 'login' ? (
              <>
                <ShieldCheck className="h-4 w-4" />
                Sign In to Candidate Dashboard
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Create Candidate Account
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-3 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-paper-800" />
          </div>
          <span className="relative bg-paper-900 px-2 font-mono text-[9px] uppercase tracking-widest text-paper-500">
            OR OAUTH
          </span>
        </div>

        {/* Google OAuth Button */}
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="rectangular"
            text={mode === 'login' ? 'signin_with' : 'signup_with'}
            width="100%"
          />
        </div>

        {/* Footer Note */}
        <p className="font-mono text-[9px] text-paper-500 text-center uppercase tracking-wider pt-2 border-t border-paper-800">
          Secured by HTTP-Only Cookie JWT Session
        </p>
      </motion.div>
    </div>
  );
};

export default AuthModal;
