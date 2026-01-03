import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Button = forwardRef(({
  className,
  variant = "default",
  size = "default",
  loading = false,
  children,
  ...props
}, ref) => {
  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border-2 border-white/30 bg-transparent text-white hover:bg-white/10",
    secondary: "bg-white/20 text-white hover:bg-white/30",
    ghost: "hover:bg-white/10 text-white",
    link: "text-blue-300 underline-offset-4 hover:underline",
    glass: "bg-white/10 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/20 shadow-lg",
  };

  const sizes = {
    default: "h-12 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-14 rounded-xl px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
        variants[variant],
        sizes[size],
        loading && "cursor-not-allowed",
        className
      )}
      ref={ref}
      disabled={loading}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 bg-current opacity-20"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {children}
      </span>
    </motion.button>
  );
});

Button.displayName = "Button";

export { Button };
