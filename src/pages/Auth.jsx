import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BrandPanel } from '../components/BrandPanel';
import { AuthTabs } from '../components/AuthTabs';
import { GlassCard } from '../components/GlassCard';
import { Toaster } from 'react-hot-toast';
import { supabase } from '../services/supabase';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for tab parameter in URL (for password reset flow)
    const tab = searchParams.get('tab');
    if (tab && ['login', 'register', 'forgot', 'reset'].includes(tab)) {
      setActiveTab(tab);
    }

    // Handle password reset tokens from email link
    // Supabase sends tokens in URL hash fragment (e.g., #access_token=...)
    const handlePasswordReset = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      if (accessToken && type === 'recovery') {
        try {
          // Set the session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
          } else {
            console.log('Session established for password reset:', data);
            // User clicked password reset link - show reset form
            setActiveTab('reset');
            // Update URL to show reset tab and clear hash
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.set('tab', 'reset');
            window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
          }
        } catch (error) {
          console.error('Error handling password reset:', error);
        }
      }
    };

    handlePasswordReset();
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL without causing navigation
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tab);
    window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Blobs */}
      <motion.div
        className="absolute top-10 left-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Illustration Panel */}
          <motion.div
            className="hidden lg:flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Background Gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Animated Music Icon */}
            <motion.div
              className="relative mb-8 z-10"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div 
                className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl relative"
                animate={{
                  boxShadow: [
                    '0 20px 60px rgba(147, 51, 234, 0.4)',
                    '0 20px 80px rgba(59, 130, 246, 0.6)',
                    '0 20px 60px rgba(147, 51, 234, 0.4)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.span 
                  className="text-6xl"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🎵
                </motion.span>
                
                {/* Pulsing Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white/30"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>
              {/* Orbiting Dots */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-white rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 8) * 80,
                    y: Math.sin((i * Math.PI * 2) / 8) * 80,
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Brand Text */}
            <motion.h1 
              className="text-5xl font-bold text-white mb-4 text-center z-10 relative"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.5)',
                  '0 0 40px rgba(147, 51, 234, 0.8)',
                  '0 0 20px rgba(255, 255, 255, 0.5)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ESSAI
            </motion.h1>
            <motion.p 
              className="text-white/80 text-center text-lg mb-8 z-10 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Welcome back! Let's make some music together
            </motion.p>

            {/* Floating Music Notes with Enhanced Animation */}
            <div className="relative w-full h-32 z-10">
              {['♪', '♫', '♬', '♩', '♭'].map((note, i) => (
                <motion.div
                  key={i}
                  className="absolute text-white/50 text-4xl"
                  style={{
                    left: `${10 + i * 20}%`,
                    top: `${15 + (i % 2) * 30}%`,
                  }}
                  animate={{
                    y: [-15, 15, -15],
                    x: [-5, 5, -5],
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                >
                  {note}
                </motion.div>
              ))}
            </div>

            {/* Animated Wave Lines */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white/40 rounded-full"
                  animate={{
                    height: [20, 40, 60, 40, 20],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlassCard activeTab={activeTab} onTabChange={handleTabChange} />
          </motion.div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  );
};

export default Auth;
