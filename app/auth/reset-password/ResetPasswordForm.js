'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Globe, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/apiClient';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) setResetToken(token);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.resetPassword({ token: resetToken, newPassword });
      toast.success('Password reset successfully!');
      router.push('/auth');
    } catch (error) {
      toast.error(error.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/auth">
          <Button variant="ghost" className="text-purple-300 hover:text-purple-200 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </Link>

        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Globe className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Kinovo
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-6">Reset Password</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="token" className="text-purple-200">Reset Token</Label>
              <Input
                id="token"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
                className="mt-2 bg-white/10 border-purple-500/30 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-purple-200">New Password</Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="mt-2 bg-white/10 border-purple-500/30 text-white"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
