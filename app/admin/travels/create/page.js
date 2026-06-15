'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { adminTravelApi } from '@/lib/apiClient';
import { toast } from 'sonner';
import { AdminShell } from '@/components/admin/AdminShell';
import { TravelForm } from '@/components/admin/TravelForm';
import { EMPTY_TRAVEL_FORM } from '@/lib/adminConstants';

export default function AdminCreateTravelPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_TRAVEL_FORM);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await adminTravelApi.create(form, token);
      toast.success('Travel created successfully');
      router.push(`/admin/travels/${data.travel.id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create travel');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Create Travel"
      subtitle="Add a new trip listing to Discover"
      action={
        <Link href="/admin/travels">
          <Button variant="outline" className="border-purple-500/30 text-purple-200 h-10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to list
          </Button>
        </Link>
      }
    >
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white/5 border border-purple-500/20 p-5 lg:p-8">
        <TravelForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Create Travel"
          token={token}
        />
      </div>
    </AdminShell>
  );
}
