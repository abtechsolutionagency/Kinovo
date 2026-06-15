'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  UserPlus,
  Settings,
  Sparkles,
  Compass,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { profileApi } from '@/lib/apiClient';
import { resolveAvatarUrl } from '@/lib/avatarUrl';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageContent, GlassCard, HeroBanner, StatPill } from '@/components/AppPage';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [token, setUser]);

  if (loading) {
    return (
      <AppPage>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </AppPage>
    );
  }

  if (!user) return null;

  const prefs = user.travelPreferences || {};
  const trustPercent = Math.min(Math.max((user.trustScore || 0) * 20, 8), 100);
  const profileComplete = [
    user.bio,
    user.location,
    user.languages?.length,
    user.interests?.length,
    prefs.budget,
  ].filter(Boolean).length;

  const handleLogout = async () => {
    await logoutAsync();
    toast.success('Logged out successfully');
    router.push('/auth');
  };

  return (
    <AppPage>
      <HeroBanner alt="Profile cover">
        <Link href="/profile/edit" className="absolute top-4 right-4">
          <Button size="sm" className="bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </Link>
      </HeroBanner>

      <PageContent className="-mt-14 lg:-mt-20 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Left: identity */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
        <div className="flex gap-4 items-end lg:flex-col lg:items-start lg:gap-4">
          <div className="relative shrink-0">
            <img
              src={resolveAvatarUrl(user.avatar)}
              alt={user.name}
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl border-4 border-slate-950 object-cover bg-purple-900/50 shadow-xl"
            />
            {user.verified && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-500 border-2 border-slate-950 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pb-1 lg:pb-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold text-white truncate">{user.name}</h1>
              {user.isPremium && <Crown className="w-5 h-5 text-yellow-400 shrink-0" />}
            </div>
            <p className="text-purple-300 text-sm flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {user.location || 'Add your location'}
            </p>
          </div>
        </div>

        <p className="text-purple-200 text-sm lg:text-base leading-relaxed">
          {user.bio || 'Tell travelers about yourself — add a bio in Edit Profile.'}
        </p>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-2">
          <Link href="/travels">
            <GlassCard className="!p-3 lg:!p-4 text-center lg:text-left lg:flex lg:items-center lg:gap-3 hover:!border-purple-400/50">
              <Plane className="w-5 h-5 text-purple-400 mx-auto lg:mx-0 mb-1 lg:mb-0" />
              <span className="text-xs lg:text-sm text-purple-200">Travels</span>
            </GlassCard>
          </Link>
          <Link href="/connections">
            <GlassCard className="!p-3 lg:!p-4 text-center lg:text-left lg:flex lg:items-center lg:gap-3 hover:!border-purple-400/50">
              <UserPlus className="w-5 h-5 text-pink-400 mx-auto lg:mx-0 mb-1 lg:mb-0" />
              <span className="text-xs lg:text-sm text-purple-200">Connect</span>
            </GlassCard>
          </Link>
          <Link href="/messages">
            <GlassCard className="!p-3 lg:!p-4 text-center lg:text-left lg:flex lg:items-center lg:gap-3 hover:!border-purple-400/50">
              <MessageCircle className="w-5 h-5 text-purple-400 mx-auto lg:mx-0 mb-1 lg:mb-0" />
              <span className="text-xs lg:text-sm text-purple-200">Messages</span>
            </GlassCard>
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex gap-2 overflow-x-auto pb-1 lg:overflow-visible lg:grid lg:grid-cols-2 lg:gap-2 scrollbar-hide">
          <StatPill icon={Shield} label="Trust" value={user.trustScore || 0} />
          <StatPill icon={Heart} label="Interests" value={user.interests?.length || 0} />
          <StatPill icon={Languages} label="Languages" value={user.languages?.length || 0} />
          <StatPill icon={Sparkles} label="Profile" value={`${profileComplete}/5`} />
        </div>
          </div>

          {/* Right: details & settings */}
          <div className="lg:col-span-8 space-y-4 mt-5 lg:mt-0">

        <GlassCard className="mb-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-purple-200 font-semibold text-sm">Trust Score</span>
            <span className="text-xl font-bold text-purple-300">{user.trustScore || 0}/5</span>
          </div>
          <Progress value={trustPercent} className="h-2.5 bg-purple-950/80 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500" />
          <p className="text-purple-400 text-xs mt-2">
            Verify your profile and connect with travelers to increase trust.
          </p>
        </GlassCard>

        {user.languages?.length > 0 && (
          <GlassCard className="mb-4">
            <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3 text-sm">
              <Languages className="w-4 h-4" />
              Languages
            </div>
            <div className="flex flex-wrap gap-2">
              {user.languages.map((lang) => (
                <Badge key={lang} className="bg-purple-500/25 text-purple-200 border-purple-500/40">
                  {lang}
                </Badge>
              ))}
            </div>
          </GlassCard>
        )}

        {user.interests?.length > 0 && (
          <GlassCard className="mb-4">
            <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3 text-sm">
              <Heart className="w-4 h-4" />
              Travel Interests
            </div>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <Badge key={interest} className="bg-pink-500/25 text-pink-200 border-pink-500/40">
                  {interest}
                </Badge>
              ))}
            </div>
          </GlassCard>
        )}

        {(prefs.budget || prefs.travelStyle || prefs.accommodation) && (
          <GlassCard className="mb-0">
            <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3 text-sm">
              <Plane className="w-4 h-4" />
              Travel Preferences
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
              {prefs.budget && (
                <div className="rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-purple-400 text-xs block">Budget</span>
                  <span className="text-white">{prefs.budget}</span>
                </div>
              )}
              {prefs.travelStyle && (
                <div className="rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-purple-400 text-xs block">Style</span>
                  <span className="text-white">{prefs.travelStyle}</span>
                </div>
              )}
              {prefs.accommodation && (
                <div className="rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-purple-400 text-xs block">Stay</span>
                  <span className="text-white">{prefs.accommodation}</span>
                </div>
              )}
              {prefs.tripDuration && (
                <div className="rounded-lg bg-white/5 px-3 py-2">
                  <span className="text-purple-400 text-xs block">Duration</span>
                  <span className="text-white">{prefs.tripDuration}</span>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        {!user.isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-purple-900/60 to-pink-900/40 p-5 lg:p-6"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Go Premium</h3>
                <p className="text-purple-200 text-sm mt-1">
                  Unlimited AI concierge, translation & profile boosts
                </p>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 h-11 font-semibold">
              Upgrade · £4.99/mo
            </Button>
          </motion.div>
        )}

        {user.memberSince && (
          <p className="text-center lg:text-left text-purple-500 text-xs">Member since {user.memberSince}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {[
            { href: '/connections', icon: UserPlus, label: 'My Connections' },
            ...(user.role === 'admin'
              ? [{ href: '/admin/travels', icon: Settings, label: 'Admin Dashboard', accent: true }]
              : []),
            { href: '/profile/edit', icon: Edit, label: 'Account Settings' },
            { href: '/safety', icon: Shield, label: 'Safety Center' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="outline"
                className={`w-full h-12 justify-start bg-white/5 border-purple-500/20 text-white hover:bg-white/10 ${
                  item.accent ? 'border-purple-500/40 text-purple-200' : ''
                }`}
              >
                <item.icon className="w-4 h-4 mr-3 opacity-80" />
                {item.label}
              </Button>
            </Link>
          ))}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-12 justify-start bg-red-500/5 border-red-500/25 text-red-300 hover:bg-red-500/10 lg:col-span-2"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Log Out
          </Button>
        </div>
          </div>
        </div>
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
