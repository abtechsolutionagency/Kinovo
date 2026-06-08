'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Edit,
  MapPin,
  Languages,
  Heart,
  Shield,
  Crown,
  LogOut,
  Plane,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { profileApi } from '@/lib/apiClient';
import { resolveAvatarUrl } from '@/lib/avatarUrl';
import { BottomNav } from '@/components/BottomNav';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, token, setUser, logoutAsync } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await profileApi.getProfile(token);
        setUser(data.user);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [token, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const prefs = user.travelPreferences || {};

  const handleLogout = async () => {
    await logoutAsync();
    toast.success('Logged out successfully');
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 pb-20">
      <div className="relative h-48 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="absolute top-4 right-4">
          <Link href="/profile/edit">
            <Button size="sm" variant="ghost" className="text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-4 -mt-16">
        <div className="flex items-end gap-4 mb-6">
          <div className="relative">
            <img
              src={resolveAvatarUrl(user.avatar)}
              alt={user.name}
              className="w-32 h-32 rounded-2xl border-4 border-slate-950 bg-white/10 object-cover"
            />
            {user.verified && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-500 border-4 border-slate-950 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              {user.isPremium && <Crown className="w-6 h-6 text-yellow-400" />}
            </div>
            <div className="flex items-center gap-2 text-purple-300 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{user.location || 'Add your location'}</span>
            </div>
            <p className="text-purple-400 text-xs mt-1">{user.email}</p>
          </div>
        </div>

        <p className="text-purple-200 mb-6">{user.bio || 'Add a bio to tell others about yourself.'}</p>

        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-200 font-semibold">Trust Score</span>
            <span className="text-2xl font-bold text-purple-400">{user.trustScore || 0}</span>
          </div>
          <Progress value={(user.trustScore || 0) * 20} className="h-2" />
        </div>

        {user.languages?.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
              <Languages className="w-5 h-5" />
              <span>Languages</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((lang) => (
                <Badge key={lang} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {user.interests?.length > 0 && (
          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
              <Heart className="w-5 h-5" />
              <span>Travel Interests</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {(prefs.budget || prefs.travelStyle || prefs.accommodation) && (
          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
              <Plane className="w-5 h-5" />
              <span>Travel Preferences</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {prefs.budget && (
                <div className="text-purple-300">
                  <span className="text-purple-400">Budget:</span> {prefs.budget}
                </div>
              )}
              {prefs.travelStyle && (
                <div className="text-purple-300">
                  <span className="text-purple-400">Style:</span> {prefs.travelStyle}
                </div>
              )}
              {prefs.accommodation && (
                <div className="text-purple-300">
                  <span className="text-purple-400">Stay:</span> {prefs.accommodation}
                </div>
              )}
              {prefs.tripDuration && (
                <div className="text-purple-300">
                  <span className="text-purple-400">Duration:</span> {prefs.tripDuration}
                </div>
              )}
            </div>
          </div>
        )}

        {!user.isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Upgrade to Premium</h3>
                <p className="text-purple-300 text-sm">Unlock unlimited features</p>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Upgrade Now - £4.99/month
            </Button>
          </motion.div>
        )}

        {user.memberSince && (
          <div className="text-center text-purple-400 text-sm mb-6">
            Member since {user.memberSince}
          </div>
        )}

        <div className="space-y-2">
          <Link href="/profile/edit">
            <Button variant="outline" className="w-full bg-white/5 border-purple-500/20 text-white hover:bg-white/10">
              Account Settings
            </Button>
          </Link>
          <Link href="/safety">
            <Button variant="outline" className="w-full bg-white/5 border-purple-500/20 text-white hover:bg-white/10">
              <Shield className="w-4 h-4 mr-2" />
              Safety Center
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full bg-white/5 border-red-500/30 text-red-300 hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
