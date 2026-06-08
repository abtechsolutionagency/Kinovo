'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, Sparkles, Lock, Heart, Plane, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProfileEnhancer } from '@/components/ProfileEnhancer';
import { ProfileImporter } from '@/components/ProfileImporter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { authApi, profileApi } from '@/lib/apiClient';
import { TRAVEL_INTERESTS, TRAVEL_PREFERENCE_OPTIONS, DEFAULT_TRAVEL_PREFERENCES } from '@/lib/profileOptions';
import { resolveAvatarUrl } from '@/lib/avatarUrl';

export default function ProfileEditPage() {
  const { user, token, setUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [preferences, setPreferences] = useState(DEFAULT_TRAVEL_PREFERENCES);
  const [languagesInput, setLanguagesInput] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function load() {
      try {
        const data = await profileApi.getProfile(token);
        if (cancelled) return;
        setProfile({ ...data.user });
        setInterests(data.user.interests || []);
        setPreferences({ ...DEFAULT_TRAVEL_PREFERENCES, ...(data.user.travelPreferences || {}) });
        setLanguagesInput((data.user.languages || []).join(', '));
        setUser(data.user);
      } catch {
        if (cancelled) return;
        const fallbackUser = useAuthStore.getState().user;
        if (fallbackUser) {
          setProfile({ ...fallbackUser });
          setInterests(fallbackUser.interests || []);
          setPreferences({ ...DEFAULT_TRAVEL_PREFERENCES, ...(fallbackUser.travelPreferences || {}) });
          setLanguagesInput((fallbackUser.languages || []).join(', '));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, setUser]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  const syncUser = (updatedUser) => {
    setUser(updatedUser);
    setProfile({ ...updatedUser });
    setLanguagesInput((updatedUser.languages || []).join(', '));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const data = await profileApi.updateProfile(
        {
          name: profile.name,
          bio: profile.bio,
          location: profile.location,
          languages: languagesInput.split(',').map((l) => l.trim()).filter(Boolean),
        },
        token
      );
      syncUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await profileApi.uploadAvatar(file, token);
      syncUser(data.user);
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSaveInterests = async () => {
    setSaving(true);
    try {
      const data = await profileApi.updateInterests(interests, token);
      syncUser(data.user);
      toast.success('Travel interests saved!');
    } catch (error) {
      toast.error(error.message || 'Failed to save interests');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const data = await profileApi.updatePreferences(preferences, token);
      syncUser(data.user);
      toast.success('Travel preferences saved!');
    } catch (error) {
      toast.error(error.message || 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleBioUpdate = async (newBio) => {
    setProfile({ ...profile, bio: newBio });
    try {
      const data = await profileApi.updateProfile({ bio: newBio }, token);
      syncUser(data.user);
      toast.success('Bio updated!');
    } catch {
      toast.error('Bio saved locally only');
    }
    setActiveTab('edit');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword }, token);
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 pb-20">
      <div className="bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="text-purple-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={resolveAvatarUrl(profile.avatar)}
              alt={profile.name}
              className="w-24 h-24 rounded-2xl border-2 border-purple-500/30 object-cover"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-700 transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <p className="text-purple-400 text-xs mt-3">Tap camera to upload photo (max 5MB)</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 bg-white/5 border border-purple-500/20 h-auto gap-1 p-1">
            <TabsTrigger value="edit" className="data-[state=active]:bg-purple-600 text-xs sm:text-sm">Edit</TabsTrigger>
            <TabsTrigger value="interests" className="data-[state=active]:bg-purple-600 text-xs sm:text-sm">
              <Heart className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Interests</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-600 text-xs sm:text-sm">
              <Plane className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Prefs</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:bg-purple-600 text-xs sm:text-sm">
              <Lock className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="enhance" className="data-[state=active]:bg-purple-600 text-xs sm:text-sm">
              <Sparkles className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="import" className="data-[state=active]:bg-purple-600 text-xs sm:text-sm">
              <Upload className="w-3 h-3" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-6">
            <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 space-y-4">
              <div>
                <Label htmlFor="name" className="text-purple-200">Display Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-2 bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-purple-200">Location</Label>
                <Input
                  id="location"
                  value={profile.location || ''}
                  onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="London, UK"
                  className="mt-2 bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="bio" className="text-purple-200">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="mt-2 min-h-[120px] bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="languages" className="text-purple-200">Languages (comma separated)</Label>
                <Input
                  id="languages"
                  value={languagesInput}
                  onChange={(e) => setLanguagesInput(e.target.value)}
                  placeholder="English, Spanish, French"
                  className="mt-2 bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="interests" className="mt-6">
            <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-semibold">Travel Interests</h3>
              <p className="text-purple-300 text-sm">Select what you enjoy while traveling</p>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_INTERESTS.map((interest) => {
                  const selected = interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                        selected
                          ? 'bg-pink-600/30 border-pink-500 text-pink-200'
                          : 'bg-white/5 border-purple-500/20 text-purple-300 hover:border-purple-500/50'
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
              <Button onClick={handleSaveInterests} disabled={saving} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                {saving ? 'Saving...' : 'Save Interests'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-semibold">Travel Preferences</h3>
              <p className="text-purple-300 text-sm">Help us match you with compatible travelers</p>

              {Object.entries(TRAVEL_PREFERENCE_OPTIONS).map(([key, options]) => (
                <div key={key}>
                  <Label className="text-purple-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                  <Select
                    value={preferences[key] || undefined}
                    onValueChange={(val) => setPreferences((prev) => ({ ...prev, [key]: val }))}
                  >
                    <SelectTrigger className="mt-2 bg-white/10 border-purple-500/30 text-white">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((opt) => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <div className="space-y-3 pt-2">
                {['nightlife', 'adventure', 'culture', 'beach'].map((key) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="text-purple-200 capitalize">{key}</Label>
                    <Switch
                      checked={!!preferences[key]}
                      onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, [key]: checked }))}
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleSavePreferences} disabled={saving} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <form onSubmit={handleChangePassword} className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-semibold">Change Password</h3>
              <div>
                <Label htmlFor="current" className="text-purple-200">Current Password</Label>
                <Input
                  id="current"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="mt-2 bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="new" className="text-purple-200">New Password</Label>
                <Input
                  id="new"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-2 bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
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
