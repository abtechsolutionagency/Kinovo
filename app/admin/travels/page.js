'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Loader2, MapPin, Calendar, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { adminTravelApi } from '@/lib/apiClient';
import { toast } from 'sonner';
import { AdminShell } from '@/components/admin/AdminShell';
import { Badge } from '@/components/ui/badge';
import { resolveMediaUrl } from '@/lib/avatarUrl';
import { TRAVEL_STATUSES } from '@/lib/adminConstants';

function StatusBadge({ status, published }) {
  const colors = {
    planned: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    ongoing: 'bg-green-500/20 text-green-300 border-green-500/30',
    completed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge className={`capitalize text-xs ${colors[status] || colors.planned}`}>{status}</Badge>
      <Badge
        className={
          published
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
        }
      >
        {published ? 'Published' : 'Draft'}
      </Badge>
    </div>
  );
}

export default function AdminTravelsPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [travels, setTravels] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (publishedFilter) params.published = publishedFilter;
      const data = await adminTravelApi.list(params, token);
      setTravels(data.travels || []);
      setTotal(data.total ?? data.travels?.length ?? 0);
    } catch (err) {
      toast.error(err.message || 'Failed to load travels');
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, publishedFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB') : '—');

  return (
    <AdminShell
      title="Travel Listings"
      subtitle={`${total} total · manage destinations & trips`}
      action={
        <Link href="/admin/travels/create">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-10">
            <Plus className="w-4 h-4 mr-2" />
            Create Travel
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: total },
          { label: 'Published', value: travels.filter((t) => t.published).length },
          { label: 'Planned', value: travels.filter((t) => t.status === 'planned').length },
          { label: 'Drafts', value: travels.filter((t) => !t.published).length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white/5 border border-purple-500/20 px-4 py-3">
            <p className="text-purple-400 text-xs uppercase tracking-wide">{stat.label}</p>
            <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-xl bg-white/5 border border-purple-500/20">
        <div className="flex items-center gap-2 text-purple-300 text-sm shrink-0">
          <Filter className="w-4 h-4" />
          Filters
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg bg-white/10 border border-purple-500/30 text-white px-3 text-sm flex-1 sm:max-w-[180px]"
        >
          <option value="" className="bg-slate-900">All statuses</option>
          {TRAVEL_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-slate-900 capitalize">{s}</option>
          ))}
        </select>
        <select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value)}
          className="h-9 rounded-lg bg-white/10 border border-purple-500/30 text-white px-3 text-sm flex-1 sm:max-w-[180px]"
        >
          <option value="" className="bg-slate-900">All visibility</option>
          <option value="true" className="bg-slate-900">Published</option>
          <option value="false" className="bg-slate-900">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      ) : travels.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-purple-500/30 bg-white/5">
          <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-60" />
          <h3 className="text-white font-semibold mb-2">No travels found</h3>
          <p className="text-purple-300 text-sm mb-6">Create your first travel listing for Discover.</p>
          <Link href="/admin/travels/create">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Create Travel</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {travels.map((t) => (
            <article
              key={t.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/admin/travels/${t.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(`/admin/travels/${t.id}`);
                }
              }}
              className="group rounded-2xl bg-white/5 border border-purple-500/20 overflow-hidden hover:border-purple-400/50 hover:bg-white/[0.07] transition-all flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <div className="aspect-[16/10] relative bg-purple-950/50">
                {t.image ? (
                  <img src={resolveMediaUrl(t.image)} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-purple-500/50" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={t.status} published={t.published} />
                </div>
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-purple-300" />
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-white font-semibold line-clamp-1 group-hover:text-purple-100">{t.title}</h3>
                <p className="text-purple-400 text-sm flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {t.destinationName || t.destinationId}
                </p>
                <p className="text-purple-300 text-xs flex items-center gap-1 mt-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {fmtDate(t.startDate)}
                  {t.endDate ? ` → ${fmtDate(t.endDate)}` : ''}
                </p>
                {t.travelStyle && (
                  <p className="text-purple-500 text-xs mt-1 capitalize">{t.travelStyle}</p>
                )}
                <p className="text-purple-400 text-sm line-clamp-2 mt-2 flex-1">{t.description}</p>
                <p className="text-purple-500 text-xs mt-3 pt-3 border-t border-purple-500/10 group-hover:text-purple-300">
                  Click to view & edit →
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
