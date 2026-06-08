'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLoginSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data =
        mode === 'login'
          ? await authApi.login({ email, password })
          : await authApi.signup({
              email,
              password,
              name: name || email.split('@')[0],
              inviteCode,
            });

      setAuth({ user: data.user, token: data.token });
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created successfully!');
      router.push('/discover');
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authApi.forgotPassword({ email });
      toast.success(data.message);
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setMode('reset');
        toast.info('Dev mode: reset token loaded automatically');
      }
    } catch (error) {
      toast.error(error.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.resetPassword({ token: resetToken, newPassword });
      toast.success('Password reset! You can sign in now.');
      setMode('login');
      setPassword('');
      setResetToken('');
      setNewPassword('');
    } catch (error) {
      toast.error(error.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: 'Welcome Back',
    signup: 'Join Kinovo',
    forgot: 'Forgot Password',
    reset: 'Reset Password',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="text-purple-300 hover:text-purple-200 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <Globe className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kinovo
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{titles[mode]}</h1>
            <p className="text-purple-300">
              {mode === 'login' && 'Sign in to your account'}
              {mode === 'signup' && 'Create your account'}
              {mode === 'forgot' && "We'll send you a reset link"}
              {mode === 'reset' && 'Enter your new password'}
            </p>
            {mode === 'signup' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm mt-4">
                <Sparkles className="w-3 h-3" />
                Private Beta - Invite Only
              </div>
            )}
          </div>

          {(mode === 'login' || mode === 'signup') && (
            <form onSubmit={handleLoginSignup} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-purple-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-purple-200">Password</Label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-2 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                />
              </div>

              {mode === 'signup' && (
                <>
                  <div>
                    <Label htmlFor="name" className="text-purple-200">Display Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-2 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inviteCode" className="text-purple-200">Invite Code</Label>
                    <Input
                      id="inviteCode"
                      type="text"
                      placeholder="KINOVO2025"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      required
                      className="mt-2 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                    />
                    <p className="text-xs text-purple-400 mt-1">
                      Don&apos;t have one? <Link href="/" className="underline">Join waitlist</Link>
                    </p>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label htmlFor="forgot-email" className="text-purple-200">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-purple-400 hover:text-purple-300">
                Back to sign in
              </button>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="reset-token" className="text-purple-200">Reset Token</Label>
                <Input
                  id="reset-token"
                  type="text"
                  placeholder="Paste token from email"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                  className="mt-2 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="new-password" className="text-purple-200">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-2 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-purple-400 hover:text-purple-300">
                Back to sign in
              </button>
            </form>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div className="mt-6 text-center text-purple-300">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
