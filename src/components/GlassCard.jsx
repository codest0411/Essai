import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, Chrome, KeyRound, ArrowLeft } from 'lucide-react';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '@/schemas/authSchemas';
import { Input } from './Input';
import { Button } from './Button';
import { PasswordStrength } from './PasswordStrength';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const GlassCard = ({ activeTab, onTabChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const { signIn, signUp, signInWithGoogle, signInWithOTP, verifyOTP, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'login', label: 'Login' },
    { id: 'register', label: 'Register' },
    { id: 'code', label: 'Sign in with Code' },
    { id: 'forgot', label: 'Forgot Password' },
  ];

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', username: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const forgotForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const codeForm = useForm({
    defaultValues: { email: '' },
  });

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) throw error;
      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, {
        full_name: data.fullName,
        username: data.username,
      });
      if (error) throw error;
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/auth?tab=login');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (data) => {
    setLoading(true);
    try {
      const { error } = await resetPassword(data.email);
      if (error) throw error;
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    setLoading(true);
    try {
      const { error } = await updatePassword(data.password);
      if (error) {
        // Provide helpful error message for common issues
        if (error.message.includes('session')) {
          throw new Error('Password reset link has expired or is invalid. Please request a new one.');
        }
        throw error;
      }
      // Show success message and logout user
      setPasswordResetSuccess(true);
      toast.success('Password changed successfully!');
      // Sign out the user after password reset
      await supabase.auth.signOut();
    } catch (error) {
      toast.error(error.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      toast.success('Google login successful!');
      navigate('/home');
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  const handleSendOTP = async (email) => {
    setLoading(true);
    try {
      const { error } = await signInWithOTP(email);
      if (error) {
        if (error.message.includes('User not found') || error.message.includes('Invalid')) {
          throw new Error('No account found with this email. Please register first.');
        }
        throw error;
      }
      setOtpSent(true);
      setOtpEmail(email);
      toast.success('Verification code sent to your email!');
    } catch (error) {
      toast.error(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const { error } = await verifyOTP(otpEmail, otpCode);
      if (error) throw error;
      toast.success('Login successful!');
      navigate('/home');
    } catch (error) {
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <motion.form
      onSubmit={loginForm.handleSubmit(handleLogin)}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        <Input
          {...loginForm.register('email')}
          type="email"
          placeholder="Enter your email"
          icon={Mail}
          error={loginForm.formState.errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            {...loginForm.register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={Lock}
            error={loginForm.formState.errors.password?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {/* Password chnge frpm password down  */}
        {/* <div className="text-right">
          <button
            type="button"
            onClick={() => onTabChange('forgot')}
            className="text-sm text-blue-300 hover:text-blue-200 hover:underline transition-colors"
          >
            Forgot password?
          </button>
        </div> */}
      </div>

      <Button type="submit" className="w-full" loading={loading} size="lg">
        Sign In
      </Button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-white/70">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="glass"
        className="w-full"
        onClick={handleGoogleLogin}
        size="lg"
      >
        <Chrome className="h-5 w-5 mr-2" />
        Continue with Google
      </Button>

      <div className="text-center mt-6">
        <div className="text-sm text-white/70">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onTabChange('register')}
            className="text-blue-300 hover:text-blue-200 hover:underline font-semibold transition-colors"
          >
            Sign up
          </button>
        </div>
      </div>
    </motion.form>
  );

  const renderRegisterForm = () => (
    <motion.form
      onSubmit={registerForm.handleSubmit(handleRegister)}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div>
        <Input
          {...registerForm.register('fullName')}
          placeholder="Full Name"
          icon={User}
          error={registerForm.formState.errors.fullName?.message}
        />
      </div>

      <div>
        <Input
          {...registerForm.register('username')}
          placeholder="Username"
          icon={User}
          error={registerForm.formState.errors.username?.message}
        />
      </div>

      <div>
        <Input
          {...registerForm.register('email')}
          type="email"
          placeholder="Email"
          icon={Mail}
          error={registerForm.formState.errors.email?.message}
        />
      </div>

      <div className="relative">
        <Input
          {...registerForm.register('password')}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          icon={Lock}
          error={registerForm.formState.errors.password?.message}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
        <PasswordStrength password={registerForm.watch('password')} />
      </div>

      <div className="relative">
        <Input
          {...registerForm.register('confirmPassword')}
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          icon={Lock}
          error={registerForm.formState.errors.confirmPassword?.message}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        >
          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex items-start space-x-3">
        <input
          {...registerForm.register('terms')}
          type="checkbox"
          className="mt-1 w-4 h-4 rounded border-2 border-white/30 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-400"
        />
        <label className="text-sm text-white/80">
          I agree to the{' '}
          <button type="button" className="text-blue-300 hover:text-blue-200 hover:underline">
            Terms of Service
          </button>{' '}
          and{' '}
          <button type="button" className="text-blue-300 hover:text-blue-200 hover:underline">
            Privacy Policy
          </button>
        </label>
      </div>
      {registerForm.formState.errors.terms && (
        <p className="text-sm text-red-300">{registerForm.formState.errors.terms.message}</p>
      )}

      <Button type="submit" className="w-full" loading={loading} size="lg">
        Create Account
      </Button>

      <div className="text-center text-sm text-white/70 mt-6">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onTabChange('login')}
          className="text-blue-300 hover:text-blue-200 hover:underline font-semibold transition-colors"
        >
          Sign in
        </button>
      </div>
    </motion.form>
  );

  const renderForgotForm = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {!emailSent ? (
        <motion.form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-6">
          <div>
            <Input
              {...forgotForm.register('email')}
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              error={forgotForm.formState.errors.email?.message}
            />
          </div>

          <Button type="submit" className="w-full" loading={loading} size="lg">
            Send Reset Email
          </Button>
        </motion.form>
      ) : (
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Check your email</h3>
          <p className="text-white/70">
            We've sent a password reset link to your email address.
          </p>
        </motion.div>
      )}

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => onTabChange('login')}
          className="text-sm text-blue-300 hover:text-blue-200 hover:underline transition-colors"
        >
          Back to Login
        </button>
      </div>
    </motion.div>
  );

  const renderCodeForm = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {!otpSent ? (
        <motion.form
          onSubmit={codeForm.handleSubmit((data) => handleSendOTP(data.email))}
          className="space-y-6"
        >
          <div>
            <Input
              {...codeForm.register('email')}
              type="email"
              placeholder="Enter your email"
              icon={Mail}
              required
            />
          </div>

          <Button type="submit" className="w-full" loading={loading} size="lg">
            <KeyRound className="h-5 w-5 mr-2" />
            Send Verification Code
          </Button>

          <div className="text-center text-sm text-white/70">
            <p>We'll send an 8-digit code to your email.</p>
            <p className="mt-2">Only works for registered users.</p>
          </div>
        </motion.form>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white text-center mb-2">Check your email</h3>
            <p className="text-sm text-green-400 text-center mb-4">
              We've sent a verification code to <strong>{otpEmail}</strong>
            </p>
            
            <Input
              type="text"
              placeholder="Enter 8-digit code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              icon={KeyRound}
              maxLength={8}
            />
            
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                className="flex-1"
                onClick={handleVerifyOTP}
                loading={loading}
                disabled={otpCode.length !== 8}
                size="lg"
              >
                Verify Code
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOtpSent(false);
                  setOtpCode('');
                  setOtpEmail('');
                }}
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => onTabChange('login')}
          className="text-sm text-blue-300 hover:text-blue-200 hover:underline transition-colors"
        >
          Back to Login
        </button>
      </div>
    </motion.div>
  );

  const renderResetForm = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {!passwordResetSuccess ? (
        <motion.form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-6">
          <div className="relative">
            <Input
              {...resetForm.register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              icon={Lock}
              error={resetForm.formState.errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            <PasswordStrength password={resetForm.watch('password')} />
          </div>

          <div className="relative">
            <Input
              {...resetForm.register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              icon={Lock}
              error={resetForm.formState.errors.confirmPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <Button type="submit" className="w-full" loading={loading} size="lg">
            Reset Password
          </Button>
        </motion.form>
      ) : (
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Password Changed Successfully!</h3>
          <p className="text-white/70">
            Your password has been updated. You can now login with your new password.
          </p>
          <Button
            onClick={() => {
              setPasswordResetSuccess(false);
              onTabChange('login');
            }}
            className="w-full"
            size="lg"
          >
            Back to Login
          </Button>
        </motion.div>
      )}
    </motion.div>
  );

  const getFormTitle = () => {
    switch (activeTab) {
      case 'login': return 'Welcome Back';
      case 'register': return 'Create Account';
      case 'code': return 'Sign in with Code';
      case 'forgot': return 'Forgot Password';
      case 'reset': return 'Reset Password';
      default: return 'Welcome Back';
    }
  };

  return (
    <div className="bg-white/15 backdrop-blur-2xl border border-white/30 rounded-3xl p-10 shadow-2xl relative">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </button>
      {/* Tab Navigation - Cleaner Style */}
      <div className="flex gap-2 mb-8 bg-white/10 p-1.5 rounded-2xl mt-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Title */}
      <motion.h1
        key={activeTab}
        className="text-3xl font-bold text-center mb-8 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {getFormTitle()}
      </motion.h1>

      {/* Forms */}
      <AnimatePresence mode="wait">
        {activeTab === 'login' && renderLoginForm()}
        {activeTab === 'register' && renderRegisterForm()}
        {activeTab === 'code' && renderCodeForm()}
        {activeTab === 'forgot' && renderForgotForm()}
        {activeTab === 'reset' && renderResetForm()}
      </AnimatePresence>
    </div>
  );
};

export { GlassCard };
