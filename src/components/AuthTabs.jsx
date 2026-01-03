import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const AuthTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'login', label: 'Login', icon: '🔑' },
    { id: 'register', label: 'Register', icon: '🧾' },
    { id: 'forgot', label: 'Forgot Password', icon: '🔁' },
    { id: 'reset', label: 'Reset Password', icon: '🔓' },
  ];

  return (
    <div className="hidden lg:block w-1/2 p-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="h-full flex flex-col justify-center"
      >
        <motion.h2
          className="text-3xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome Back
        </motion.h2>

        <div className="space-y-3">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden group",
                activeTab === tab.id
                  ? "bg-white/20 backdrop-blur-sm border border-white/30 text-white shadow-lg"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active Tab Glow */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-pink-500/20 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* Tab Indicator */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <div className="relative z-10 flex items-center gap-4">
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium text-lg">{tab.label}</span>
              </div>

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                initial={false}
              />
            </motion.button>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Experience the future of music streaming</p>
          <p className="mt-1">with ESSAI</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export { AuthTabs };
