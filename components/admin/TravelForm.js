'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { mockDestinations } from '@/lib/mockData';
import { TRAVEL_STATUSES, TRAVEL_STYLES } from '@/lib/adminConstants';
import { ImageUploadField } from '@/components/ImageUploadField';

const selectClass =
  'mt-1.5 w-full h-10 rounded-lg bg-white/10 border border-purple-500/30 text-white px-3 text-sm focus:outline-none focus:border-purple-400';
const inputClass = 'mt-1.5 bg-white/10 border-purple-500/30 text-white';

export function TravelForm({ form, setForm, onSubmit, saving, submitLabel = 'Save Travel', token }) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-purple-200">Destination</Label>
          <select
            value={form.destinationId}
            onChange={(e) => {
              const d = mockDestinations.find((x) => x.id === e.target.value);
              setForm({
                ...form,
                destinationId: e.target.value,
                destinationName: d ? `${d.name}, ${d.country}` : e.target.value,
              });
            }}
            className={selectClass}
            required
          >
            {mockDestinations.map((d) => (
              <option key={d.id} value={d.id} className="bg-slate-900">
                {d.name}, {d.country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-purple-200">Destination display name</Label>
          <Input
            value={form.destinationName}
            onChange={(e) => setForm({ ...form, destinationName: e.target.value })}
            placeholder="Ibiza, Spain"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <Label className="text-purple-200">Title</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Summer Ibiza Experience"
          required
          className={inputClass}
        />
      </div>

      <div>
        <Label className="text-purple-200">Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Curated beach days, nightlife, and culture."
          className={`${inputClass} min-h-[100px]`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label className="text-purple-200">Start date</Label>
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div>
          <Label className="text-purple-200">End date</Label>
          <Input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <Label className="text-purple-200">Status</Label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className={selectClass}
          >
            {TRAVEL_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-slate-900 capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-purple-200">Travel style</Label>
          <select
            value={form.travelStyle}
            onChange={(e) => setForm({ ...form, travelStyle: e.target.value })}
            className={selectClass}
          >
            {TRAVEL_STYLES.map((s) => (
              <option key={s} value={s} className="bg-slate-900">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ImageUploadField
        label="Cover image"
        optional
        value={form.image}
        onChange={(url) => setForm({ ...form, image: url })}
        token={token}
        disabled={saving}
      />

      <div className="flex items-center justify-between rounded-xl bg-white/5 border border-purple-500/20 px-4 py-3">
        <div>
          <Label className="text-white">Published</Label>
          <p className="text-purple-400 text-xs mt-0.5">Visible on Discover when enabled</p>
        </div>
        <Switch
          checked={form.published}
          onCheckedChange={(checked) => setForm({ ...form, published: checked })}
        />
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="w-full sm:w-auto h-11 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-semibold"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : submitLabel}
      </Button>
    </form>
  );
}

export function travelToForm(travel) {
  const fmt = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');
  return {
    destinationId: travel.destinationId || 'ibiza',
    destinationName: travel.destinationName || '',
    title: travel.title || '',
    description: travel.description || '',
    image: travel.image || '',
    startDate: fmt(travel.startDate),
    endDate: fmt(travel.endDate),
    status: travel.status || 'planned',
    travelStyle: travel.travelStyle || 'Group',
    published: travel.published !== false,
  };
}
