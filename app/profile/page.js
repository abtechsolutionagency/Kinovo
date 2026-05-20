'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit, MapPin, Languages, Heart, Shield, Crown, Calendar, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUser } from '@/lib/mockData';
import { BottomNav } from '@/components/BottomNav';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ProfilePage() {
  const [user] = useState(mockUser);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 pb-20">
      {/* Header */}
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

      {/* Profile Info */}
      <div className="px-4 -mt-16">
        <div className="flex items-end gap-4 mb-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-2xl border-4 border-slate-950 bg-white/10"
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
              <span>{user.location}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-purple-200 mb-6">{user.bio}</p>

        {/* Trust Score */}
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-200 font-semibold">Trust Score</span>
            <span className="text-2xl font-bold text-purple-400">{user.trustScore}</span>
          </div>
          <Progress value={user.trustScore * 20} className="h-2" />
          <p className="text-purple-300 text-xs mt-2">
            Based on verifications, reviews, and community interactions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">156</div>
            <div className="text-purple-300 text-xs">Connections</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 text-center">
            <MapPin className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">12</div>
            <div className="text-purple-300 text-xs">Destinations</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">24</div>
            <div className="text-purple-300 text-xs">Events</div>
          </div>
        </div>

        {/* Languages */}
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

        {/* Interests */}
        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
            <Heart className="w-5 h-5" />
            <span>Interests</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Premium Upgrade */}
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
            <ul className="space-y-2 mb-4 text-purple-200 text-sm">
              <li>✓ Unlimited AI concierge</li>
              <li>✓ Real-time translation</li>
              <li>✓ Anonymous browsing</li>
              <li>✓ Profile boosts</li>
            </ul>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Upgrade Now - £4.99/month
            </Button>
          </motion.div>
        )}

        {/* Member Since */}
        <div className="text-center text-purple-400 text-sm mb-6">
          Member since {user.memberSince}
        </div>

        {/* Settings Links */}
        <div className="space-y-2">
          <Link href="/profile/edit">
            <Button variant="outline" className="w-full bg-white/5 border-purple-500/20 text-white hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
          </Link>
          <Link href="/safety">
            <Button variant="outline" className="w-full bg-white/5 border-purple-500/20 text-white hover:bg-white/10">
              <Shield className="w-4 h-4 mr-2" />
              Safety Center
            </Button>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
