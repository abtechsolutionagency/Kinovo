'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Trash2,
  MapPin,
  Calendar,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { adminTravelApi } from '@/lib/apiClient';
import { toast } from 'sonner';
import { AdminShell } from '@/components/admin/AdminShell';
import { TravelForm, travelToForm } from '@/components/admin/TravelForm';
import { useConfirm } from '@/components/ConfirmDialogProvider';
import { resolveMediaUrl } from '@/lib/avatarUrl';

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
}

export default function AdminTravelDetailPage() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const router = useRouter();
  const confirm = useConfirm();
  const [travel, setTravel] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadTravel = useCallback(async () => {
    if (!token || !id) return;
    setLoading(true);
    try {
      const data = await adminTravelApi.get(id, token);
      setTravel(data.travel);
      setForm(travelToForm(data.travel));
    } catch (err) {
      toast.error(err.message || 'Travel not found');
      router.replace('/admin/travels');
    } finally {
      setLoading(false);
    }
  }, [token, id, router]);

  useEffect(() => {
    loadTravel();
  }, [loadTravel]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await adminTravelApi.update(id, form, token);
      setTravel(data.travel);
      setForm(travelToForm(data.travel));
      toast.success('Travel updated successfully');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete this travel?',
      description: 'This will permanently remove the listing. This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      variant: 'destructive',
    });
    if (!ok) return;

    setDeleting(true);
    try {
      await adminTravelApi.delete(id, token);
      toast.success('Travel deleted successfully');
      router.push('/admin/travels');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
      setDeleting(false);
    }
  };

  if (loading || !travel || !form) {
    return (
      <AdminShell title="Travel Details">
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </AdminShell>
    );
  }

  const statusColors = {
    planned: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    ongoing: 'bg-green-500/20 text-green-300 border-green-500/30',
    completed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
  };

  return (
    <AdminShell
      title="Travel Details"
      subtitle={travel.title}
      action={
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/travels">
            <Button variant="outline" className="border-purple-500/30 text-purple-200 h-10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to list
            </Button>
          </Link>
          <Link href={`/travel/${id}`} target="_blank">
            <Button variant="outline" className="border-purple-500/30 text-purple-200 h-10">
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview on site
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="border-red-500/30 text-red-300 h-10 hover:bg-red-500/10"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Delete
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Details panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-purple-500/20 bg-white/5">
            <div className="aspect-video relative bg-purple-950/50">
              {travel.image ? (
                <img src={resolveMediaUrl(travel.image)} alt={travel.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-purple-500/40" />
                </div>
              )}
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={`capitalize ${statusColors[travel.status] || statusColors.planned}`}>
                  {travel.status}
                </Badge>
                <Badge
                  className={
                    travel.published
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                  }
                >
                  {travel.published ? 'Published' : 'Draft'}
                </Badge>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">{travel.title}</h2>
                <p className="text-purple-400 text-sm flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4" />
                  {travel.destinationName || travel.destinationId}
                </p>
              </div>

              <p className="text-purple-200 text-sm leading-relaxed">{travel.description || 'No description'}</p>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-white/5 p-3 border border-purple-500/10">
                  <dt className="text-purple-500 text-xs uppercase tracking-wide">Start</dt>
                  <dd className="text-white mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {fmtDate(travel.startDate)}
                  </dd>
                </div>
                <div className="rounded-lg bg-white/5 p-3 border border-purple-500/10">
                  <dt className="text-purple-500 text-xs uppercase tracking-wide">End</dt>
                  <dd className="text-white mt-1">{fmtDate(travel.endDate)}</dd>
                </div>
                <div className="rounded-lg bg-white/5 p-3 border border-purple-500/10">
                  <dt className="text-purple-500 text-xs uppercase tracking-wide">Style</dt>
                  <dd className="text-white mt-1 capitalize">{travel.travelStyle || '—'}</dd>
                </div>
                <div className="rounded-lg bg-white/5 p-3 border border-purple-500/10">
                  <dt className="text-purple-500 text-xs uppercase tracking-wide">Destination ID</dt>
                  <dd className="text-white mt-1 font-mono text-xs">{travel.destinationId}</dd>
                </div>
              </dl>

              {travel.createdBy && (
                <p className="text-purple-500 text-xs pt-2 border-t border-purple-500/10">
                  Created by {travel.createdBy.name || travel.createdBy.email || 'Admin'}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-4 flex items-start gap-3">
            <Eye className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-purple-300 text-sm">
              Edit the fields on the right and click <strong className="text-white">Save Changes</strong> to update via{' '}
              <code className="text-purple-200 text-xs">PATCH /api/admin/travels/{id}</code>
            </p>
          </div>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-3 rounded-2xl bg-white/5 border border-purple-500/20 p-5 lg:p-8">
          <h3 className="text-lg font-semibold text-white mb-1">Edit Travel</h3>
          <p className="text-purple-400 text-sm mb-6">Update listing details below</p>
          <TravelForm
            form={form}
            setForm={setForm}
            onSubmit={handleUpdate}
            saving={saving}
            submitLabel="Save Changes"
            token={token}
          />
        </div>
      </div>
    </AdminShell>
  );
}
