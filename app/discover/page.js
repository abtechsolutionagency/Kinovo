'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, TrendingUp, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockDestinations, mockTravelGroups, mockUser } from '@/lib/mockData';
import { cityGroups } from '@/lib/cityGroups';
import { calculateMatchScore, getMatchLevel } from '@/lib/matchScoring';
import { BottomNav } from '@/components/BottomNav';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Discover</h1>
          <Button variant="ghost" size="icon" className="text-purple-400">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          <Input
            placeholder="Search destinations, people, groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
          />
        </div>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="destinations" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-purple-500/20">
            <TabsTrigger value="destinations" className="data-[state=active]:bg-purple-600">
              <MapPin className="w-4 h-4 mr-2" />
              Destinations
            </TabsTrigger>
            <TabsTrigger value="travelers" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Travelers
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Groups
            </TabsTrigger>
          </TabsList>

          {/* Destinations */}
          <TabsContent value="destinations" className="mt-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-purple-300 mb-4">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Trending Now</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {mockDestinations.map((destination) => (
                  <Link key={destination.id} href={`/destination/${destination.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                      <div className="aspect-[4/5] relative">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {destination.name}
                          </h3>
                          <p className="text-purple-300 text-xs mb-2">
                            {destination.country}
                          </p>
                          <div className="flex items-center gap-1 text-purple-400 text-sm">
                            <Users className="w-3 h-3" />
                            <span>{destination.travelers}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Travelers */}
          <TabsContent value="travelers" className="mt-6">
            <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI matching travelers based on your profile</span>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`}
                      alt="User"
                      className="w-16 h-16 rounded-full bg-purple-500/20"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">Traveler {i}</h3>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                      <p className="text-purple-300 text-sm mb-2">
                        {mockDestinations[i % mockDestinations.length].name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Travel', 'Music', 'Beach'].map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Connect
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Groups */}
          <TabsContent value="groups" className="mt-6">
            <div className="space-y-4">
              {mockTravelGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer"
                >
                  <div className="aspect-[16/9] relative">
                    <img
                      src={group.image}
                      alt={group.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-lg text-white text-sm">
                      {group.members}/{group.maxMembers} members
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-purple-400 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{group.destination}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">
                      {group.title}
                    </h3>
                    <p className="text-purple-300 text-sm mb-3">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-purple-400 text-sm">
                        {new Date(group.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Join Group
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
