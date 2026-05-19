'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProfileEnhancer } from '@/components/ProfileEnhancer';
import { ProfileImporter } from '@/components/ProfileImporter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { toast } from 'sonner';
import { mockUser } from '@/lib/mockData';

export default function ProfileEditPage() {
  const [profile, setProfile] = useState(mockUser);
  const [activeTab, setActiveTab] = useState('edit');

  const handleSave = () => {
    toast.success('Profile updated successfully!');
  };

  const handleBioUpdate = (newBio) => {
    setProfile({ ...profile, bio: newBio });
    toast.success('Bio updated!');
    setActiveTab('edit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 pb-20">
      <div className="bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-purple-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-purple-500/20">
            <TabsTrigger value="edit" className="data-[state=active]:bg-purple-600">
              Edit
            </TabsTrigger>
            <TabsTrigger value="enhance" className="data-[state=active]:bg-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Enhance
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-purple-600">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-6 space-y-6">
            <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 space-y-4">
              <div>
                <Label htmlFor="name" className="text-purple-200">Display Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-2 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-purple-200">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="mt-2 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-purple-200">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="mt-2 min-h-[120px] bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="enhance" className="mt-6">
            <ProfileEnhancer onUpdate={handleBioUpdate} />
          </TabsContent>

          <TabsContent value="import" className="mt-6">
            <ProfileImporter onImport={handleBioUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
