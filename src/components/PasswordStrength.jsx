import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const PasswordStrength = ({ password }) => {
  const getStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    return score;
  };

  const strength = getStrength(password || '');

  const getStrengthLabel = (strength) => {
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    if (strength === 4) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return 'bg-red-500';
    if (strength === 1) return 'bg-red-400';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    if (strength === 4) return 'bg-green-500';
    return 'bg-green-400';
  };

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2"
    >
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full transition-colors duration-300",
              i < strength ? getStrengthColor(strength) : "bg-muted"
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          />
        ))}
      </div>
      <motion.p
        className={cn(
          "text-xs font-medium",
          strength < 3 ? "text-red-500" : strength < 4 ? "text-yellow-600" : "text-green-600"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {getStrengthLabel(strength)}
      </motion.p>
    </motion.div>
  );
};

export { PasswordStrength };
