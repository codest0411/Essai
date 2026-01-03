import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Input = forwardRef(({ className, type, icon: Icon, error, ...props }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 z-10" />
        )}
        <input
          type={type}
          className={cn(
            "flex h-14 w-full rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-base text-white placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:border-blue-400 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-12",
            error && "border-red-400 focus-visible:ring-red-400/50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-red-300 mt-2 ml-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
});

Input.displayName = "Input";

export { Input };
