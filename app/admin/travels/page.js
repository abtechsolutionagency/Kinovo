'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { adminTravelApi } from '@/lib/apiClient';
import { mockDestinations } from '@/lib/mockData';
import { toast } from 'sonner';
import { AppPage, PageContent, PageHeader, GlassCard, EmptyState } from '@/components/AppPage';

export default function AdminTravelsPage() {
  const { token, user } = useAuthStore();
  const router = useRouter();
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    destinationId: mockDestinations[0]?.id || 'ibiza',
    destinationName: mockDestinations[0]?.name || 'Ibiza',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    image: '',
    travelStyle: '',
    published: true,
  });

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/profile');
    }
  }, [user, router]);

  const load = async () => {
    if (!token) return;
    try {
      const data = await adminTravelApi.list({ limit: 50 }, token);
      setTravels(data.travels || []);
    } catch {
      toast.error('Admin access required');
      router.replace('/profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminTravelApi.create(form, token);
      toast.success('Travel created');
      setShowForm(false);
      setForm({ ...form, title: '', description: '', startDate: '', endDate: '' });
      await load();
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this travel listing?')) return;
    try {
      await adminTravelApi.delete(id, token);
      toast.success('Deleted');
      await load();
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  };

  if (loading) {
    return (
      <AppPage>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </AppPage>
    );
  }

  return (
    <AppPage>
      <PageHeader
        title="Admin · Travels"
        subtitle="Manage trip listings"
        backHref="/profile"
        action={
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-purple-600 h-9">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        }
      />

      <PageContent>
        {showForm && (
          <form onSubmit={handleCreate} className="mb-6">
            <GlassCard className="space-y-3 !p-5">
            <div>
              <Label className="text-purple-200">Destination</Label>
              <select
                value={form.destinationId}
                onChange={(e) => {
                  const d = mockDestinations.find((x) => x.id === e.target.value);
                  setForm({ ...form, destinationId: e.target.value, destinationName: d?.name || e.target.value });
                }}
                className="mt-1 w-full h-10 rounded-md bg-white/10 border border-purple-500/30 text-white px-3"
              >
                {mockDestinations.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900">{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-purple-200">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1 bg-white/10 border-purple-500/30 text-white" />
            </div>
            <div>
              <Label className="text-purple-200">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 bg-white/10 border-purple-500/30 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-purple-200">Start Date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className="mt-1 bg-white/10 border-purple-500/30 text-white" />
              </div>
              <div>
                <Label className="text-purple-200">End Date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="mt-1 bg-white/10 border-purple-500/30 text-white" />
              </div>
            </div>
            <div>
              <Label className="text-purple-200">Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1 bg-white/10 border-purple-500/30 text-white" />
            </div>
            <Button type="submit" disabled={saving} className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600">
              {saving ? 'Saving...' : 'Create Travel'}
            </Button>
            </GlassCard>
          </form>
        )}

        <div className="space-y-3">
          {travels.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No travels yet"
              description="Create your first trip listing to show on Discover."
              action={
                <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Add Travel
                </Button>
              }
            />
          ) : (
            travels.map((t) => (
              <GlassCard key={t.id} className="flex gap-4 !p-4">
              {t.image && (
                <img src={t.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">{t.title}</h3>
                <p className="text-purple-400 text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {t.destinationName || t.destinationId}
                </p>
                <p className="text-purple-500 text-xs capitalize mt-1">{t.status} · {t.published ? 'Published' : 'Draft'}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/travel/${t.id}`}>
                  <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-200">View</Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)} className="text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              </GlassCard>
            ))
          )}
        </div>
      </PageContent>
    </AppPage>
  );
}
