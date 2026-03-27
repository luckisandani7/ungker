import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Loader2, ArrowRight, ChevronLeft, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Login: React.FC = () => {
  const { loginWithEmail, registerWithEmail, resetPassword, continueAsGuest, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [logoLoaded, setLogoLoaded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!isResettingPassword && !password) return;
    
    setLocalLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (isResettingPassword) {
        await resetPassword(email);
        setSuccessMessage('Email pemulihan password telah dikirim. Silakan cek inbox Anda.');
        setIsResettingPassword(false);
      } else if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan masuk.');
      } else if (err.code === 'auth/invalid-credential') {
        setError(isResettingPassword 
          ? 'Gagal memproses permintaan. Pastikan email Anda benar.' 
          : 'Email tidak terdaftar atau password salah. Silakan periksa kembali data Anda.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan gagal. Silakan coba lagi nanti atau reset password Anda.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password terlalu lemah (min. 6 karakter).');
      } else if (err.code === 'auth/user-not-found') {
        setError(isResettingPassword 
          ? 'Email tidak ditemukan. Pastikan email yang Anda masukkan sudah terdaftar.' 
          : 'Email tidak terdaftar. Silakan buat akun baru.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Password salah.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
      } else {
        setError('Gagal: ' + (err.message || 'Terjadi kesalahan.'));
      }
    } finally {
      setLocalLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background GIF with enhanced overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyZDg4MXkwbGZ2MXlzZHh2ZDI3bGYxeG8yeWpjYTF4eWd3N2JpaW10cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QEN6Cksu8d2F8RRVrg/giphy.gif"
          alt="Background"
          className="w-full h-full object-cover opacity-40 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40" />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md space-y-8 text-center relative z-10"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Border Logo with Glow */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-[2.2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-28 h-28 flex items-center justify-center overflow-hidden rounded-[2rem] shadow-2xl border border-white/10">
              {/* Rotating Gradient Border */}
              <div className="absolute w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent_0%,white_40%,white_60%,transparent_100%)] animate-[spin_6s_linear_infinite] opacity-40" />
              
              {/* Logo Inner Container */}
              <div className="relative w-[calc(100%-2px)] h-[calc(100%-2px)] bg-zinc-950 rounded-[1.95rem] flex items-center justify-center overflow-hidden">
                {!logoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 animate-pulse">
                    <Activity className="text-zinc-700" size={32} />
                  </div>
                )}
                <img 
                  src="https://i.ibb.co.com/ccBmfb50/60246a93ed6f6c4217c7f995803c103e.jpg" 
                  alt="Trading Journal App Logo" 
                  onLoad={() => setLogoLoaded(true)}
                  className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${logoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter text-white drop-shadow-sm">
              Trading <span className="text-zinc-500 font-light">Journal</span>
            </h1>
            <p className="text-zinc-500 max-w-[280px] mx-auto text-xs uppercase tracking-[0.2em] font-medium">
              "The less you know, the better you trade"
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={isResettingPassword ? 'reset' : isRegistering ? 'register' : 'login'}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                {isResettingPassword 
                  ? 'Pulihkan Password' 
                  : isRegistering 
                    ? 'Buat Akun Baru' 
                    : 'Selamat Datang'}
              </h2>
              <p className="text-sm text-zinc-500 font-medium">
                {isResettingPassword
                  ? 'Masukkan email Anda untuk link pemulihan.'
                  : isRegistering 
                    ? 'Daftar untuk mulai mencatat jurnal trading.' 
                    : 'Masuk untuk sinkronisasi data jurnal Anda.'}
              </p>
            </motion.div>
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div className="space-y-4">
              <div className="group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-white text-zinc-600">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Username / Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  className="w-full bg-zinc-950/50 border border-white/5 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all placeholder:text-zinc-700 text-sm"
                  required
                />
              </div>
              
              {!isResettingPassword && (
                <div className="space-y-3">
                  <div className="group relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-white text-zinc-600">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="w-full bg-zinc-950/50 border border-white/5 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all placeholder:text-zinc-700 text-sm"
                      required
                    />
                  </div>
                  {!isRegistering && (
                    <div className="flex justify-end px-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsResettingPassword(true);
                          setError(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 hover:text-white transition-colors"
                      >
                        Lupa Password?
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl"
                >
                  <p className="text-red-400 text-[11px] font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}

              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl"
                >
                  <p className="text-emerald-400 text-[11px] font-medium leading-relaxed">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || localLoading}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
            >
              {(loading || localLoading) ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="text-sm">
                    {isResettingPassword 
                      ? 'Kirim Link Pemulihan' 
                      : isRegistering 
                        ? 'Daftar Sekarang' 
                        : 'Masuk'}
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="space-y-4 pt-2">
            {!isResettingPassword && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-[#0a0a0a]/0 px-4 text-zinc-700">Atau</span>
                </div>
              </div>
            )}

            {!isResettingPassword && (
              <button
                onClick={continueAsGuest}
                disabled={loading || localLoading}
                className="w-full flex items-center justify-center gap-3 bg-zinc-950/50 border border-white/5 hover:bg-zinc-900 text-zinc-400 font-semibold py-3.5 px-6 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 text-xs"
              >
                <User size={16} />
                Lanjutkan sebagai Tamu
              </button>
            )}

            <div className="flex flex-col gap-3">
              {isResettingPassword ? (
                <button 
                  onClick={() => {
                    setIsResettingPassword(false);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 hover:text-white transition-colors group"
                >
                  <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                  Kembali ke Masuk
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors"
                >
                  {isRegistering 
                    ? 'Sudah punya akun? Masuk di sini' 
                    : 'Belum punya akun? Daftar gratis'}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-[10px] text-zinc-700 uppercase tracking-[0.3em] font-bold">
          © 2026 SandaniFX
        </p>
      </motion.div>
    </div>
  );
};
