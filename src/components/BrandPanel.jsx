import { motion } from 'framer-motion';
import { Music, Radio, Disc3, Sparkles, Waves, Disc2 } from 'lucide-react';

const BrandPanel = () => {
  const floatingIcons = [
    { Icon: Music, delay: 0, position: 'top-20 left-20', size: 'h-16 w-16' },
    { Icon: Radio, delay: 2, position: 'top-40 right-32', size: 'h-12 w-12' },
    { Icon: Disc3, delay: 4, position: 'bottom-32 left-32', size: 'h-20 w-20' },
    { Icon: Sparkles, delay: 1, position: 'bottom-20 right-20', size: 'h-14 w-14' },
    { Icon: Waves, delay: 3, position: 'top-1/2 left-16', size: 'h-10 w-10' },
    { Icon: Disc2, delay: 5, position: 'bottom-1/2 right-16', size: 'h-18 w-18' },
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-indigo-500/30"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(219, 39, 119, 0.3), rgba(99, 102, 241, 0.3))',
            'linear-gradient(135deg, rgba(219, 39, 119, 0.3), rgba(99, 102, 241, 0.3), rgba(147, 51, 234, 0.3))',
            'linear-gradient(225deg, rgba(99, 102, 241, 0.3), rgba(147, 51, 234, 0.3), rgba(219, 39, 119, 0.3))',
            'linear-gradient(315deg, rgba(147, 51, 234, 0.3), rgba(219, 39, 119, 0.3), rgba(99, 102, 241, 0.3))',
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, position, size }, index) => (
        <motion.div
          key={index}
          className={`absolute ${position} animate-float`}
          style={{ animationDelay: `${delay}s` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
          }}
        >
          <Icon className={`${size} text-white/30`} />
        </motion.div>
      ))}

      {/* Animated Music Bars */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-end gap-2 h-64">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 bg-white/60 rounded-full"
              style={{
                height: `${Math.random() * 100 + 50}px`,
              }}
              animate={{
                height: [
                  `${Math.random() * 100 + 50}px`,
                  `${Math.random() * 150 + 100}px`,
                  `${Math.random() * 100 + 50}px`,
                ],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Circular Waves */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full border-4 border-white/10"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Brand Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="flex items-center gap-3 mb-6"
          animate={{
            textShadow: [
              '0 0 20px rgba(255,255,255,0.5)',
              '0 0 40px rgba(255,255,255,0.8)',
              '0 0 20px rgba(255,255,255,0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Music className="h-12 w-12" />
          </motion.div>
          <span className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            ESSAI
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl font-bold mb-4 text-center"
          animate={{
            textShadow: [
              '0 0 20px rgba(255,255,255,0.3)',
              '0 0 30px rgba(255,255,255,0.5)',
              '0 0 20px rgba(255,255,255,0.3)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Feel the Music
        </motion.h1>

        <motion.p
          className="text-xl text-white/90 text-center max-w-md mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Stream unlimited music, create playlists, discover podcasts, and vibe with millions of tracks.
        </motion.p>

        <motion.div
          className="flex items-center gap-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold">50M+</div>
            <div className="text-sm text-white/80">Songs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">10M+</div>
            <div className="text-sm text-white/80">Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">100K+</div>
            <div className="text-sm text-white/80">Podcasts</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export { BrandPanel };
