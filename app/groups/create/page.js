'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { groupApi } from '@/lib/apiClient';
import { mockDestinations } from '@/lib/mockData';
import { toast } from 'sonner';
import { AppPage, PageContent, PageHeader, GlassCard } from '@/components/AppPage';
import { ImageUploadField } from '@/components/ImageUploadField';

export default function CreateGroupPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destinationId: mockDestinations[0]?.id || 'ibiza',
    title: '',
    description: '',
    date: '',
    maxMembers: 20,
    image: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    try {
      const data = await groupApi.create(form, token);
      toast.success('Group created!');
      router.push(`/groups/${data.group.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppPage>
      <PageHeader title="Create Group" subtitle="Start a travel group" backHref="/community" />
      <PageContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        <GlassCard className="space-y-4 !p-5">
        <div>
          <Label className="text-purple-200">Destination</Label>
          <select
            value={form.destinationId}
            onChange={(e) => setForm({ ...form, destinationId: e.target.value })}
            className="mt-2 w-full h-10 rounded-md bg-white/10 border border-purple-500/30 text-white px-3"
          >
            {mockDestinations.map((d) => (
              <option key={d.id} value={d.id} className="bg-slate-900">
                {d.name}, {d.country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-purple-200">Group Title</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Summer beach trip..."
            required
            className="mt-2 bg-white/10 border-purple-500/30 text-white"
          />
        </div>
        <div>
          <Label className="text-purple-200">Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What's the plan?"
            className="mt-2 min-h-[100px] bg-white/10 border-purple-500/30 text-white"
          />
        </div>
        <div>
          <Label className="text-purple-200">Date</Label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="mt-2 bg-white/10 border-purple-500/30 text-white"
          />
        </div>
        <div>
          <Label className="text-purple-200">Max Members</Label>
          <Input
            type="number"
            min={2}
            max={100}
            value={form.maxMembers}
            onChange={(e) => setForm({ ...form, maxMembers: parseInt(e.target.value, 10) || 20 })}
            className="mt-2 bg-white/10 border-purple-500/30 text-white"
          />
        </div>
        <ImageUploadField
          label="Cover image"
          optional
          value={form.image}
          onChange={(url) => setForm({ ...form, image: url })}
          token={token}
          disabled={loading}
        />
        </GlassCard>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 font-semibold"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Group'}
        </Button>
      </form>
      </PageContent>
    </AppPage>
  );
}
