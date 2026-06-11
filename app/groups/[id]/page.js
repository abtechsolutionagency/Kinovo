'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Users,
  Calendar,
  Loader2,
  Pencil,
  Save,
  X,
  Crown,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageContent, GlassCard, HeroBanner, PageHeader } from '@/components/AppPage';
import { useAuthStore } from '@/store/authStore';
import { groupApi } from '@/lib/apiClient';
import { getDestinationMeta } from '@/lib/destinations';
import { resolveAvatarUrl } from '@/lib/avatarUrl';
import { toast } from 'sonner';

export default function GroupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    maxMembers: 20,
    date: '',
    image: '',
  });

  const load = async () => {
    if (!token || !id) return;
    try {
      const data = await groupApi.get(id, token);
      setGroup(data.group);
      setEditForm({
        title: data.group.title || '',
        description: data.group.description || '',
        maxMembers: data.group.maxMembers || 20,
        date: data.group.date || '',
        image: data.group.image || '',
      });
    } catch {
      toast.error('Group not found');
      router.push('/discover');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token, id]);

  const creatorId = group?.creator?.id || group?.creator?._id;
  const isCreator = user?.id && creatorId && user.id === creatorId;
  const meta = group ? getDestinationMeta(group.destinationId) : null;
  const image = group?.image || meta?.image;

  const handleJoinLeave = async () => {
    setActionLoading(true);
    try {
      if (group.isMember && !isCreator) {
        await groupApi.leave(id, token);
        toast.success('Left group');
      } else if (!group.isMember) {
        await groupApi.join(id, token);
        toast.success('Joined group!');
      }
      await load();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const data = await groupApi.update(
        id,
        {
          title: editForm.title,
          description: editForm.description,
          maxMembers: editForm.maxMembers,
          date: editForm.date || undefined,
          image: editForm.image || undefined,
        },
        token
      );
      setGroup(data.group);
      setEditing(false);
      toast.success('Group updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update group');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AppPage>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </AppPage>
    );
  }

  if (!group) return null;

  const spotsLeft = group.maxMembers - group.memberCount;
  const fillPercent = Math.round((group.memberCount / group.maxMembers) * 100);

  if (editing) {
    return (
      <AppPage>
        <PageHeader
          title="Edit Group"
          backHref={`/groups/${id}`}
          action={
            <Button variant="ghost" size="icon" onClick={() => setEditing(false)} className="text-purple-300">
              <X className="w-5 h-5" />
            </Button>
          }
        />
        <PageContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <GlassCard className="space-y-4 !p-5">
              <div>
                <Label className="text-purple-200">Title</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  required
                  className="mt-2 bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label className="text-purple-200">Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-2 min-h-[120px] bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label className="text-purple-200">Max Members</Label>
                <Input
                  type="number"
                  min={group.memberCount || 2}
                  max={100}
                  value={editForm.maxMembers}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, maxMembers: parseInt(e.target.value, 10) || 20 }))
                  }
                  className="mt-2 bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label className="text-purple-200">Trip Date</Label>
                <Input
                  type="date"
                  value={editForm.date ? editForm.date.split('T')[0] : ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                  className="mt-2 bg-white/10 border-purple-500/30 text-white"
                />
              </div>
              <div>
                <Label className="text-purple-200">Cover Image URL</Label>
                <Input
                  value={editForm.image}
                  onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-2 bg-white/10 border-purple-500/30 text-white"
                />
              </div>
            </GlassCard>
            <Button
              type="submit"
              disabled={actionLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(false)} className="w-full text-purple-400">
              Cancel
            </Button>
          </form>
        </PageContent>
        <BottomNav />
      </AppPage>
    );
  }

  return (
    <AppPage>
      <HeroBanner src={image} alt={group.title}>
        <Link href="/discover" className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur text-white border border-white/10">
            ←
          </Button>
        </Link>
        {isCreator && (
          <Button
            onClick={() => setEditing(true)}
            size="sm"
            className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700 shadow-lg"
          >
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="bg-purple-600/90 mb-2">{meta.name}</Badge>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg line-clamp-2">{group.title}</h1>
        </div>
      </HeroBanner>

      <PageContent className="-mt-2">
        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-purple-200 bg-white/5 border border-purple-500/20 rounded-full px-3 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            {meta.name}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-purple-200 bg-white/5 border border-purple-500/20 rounded-full px-3 py-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            {group.memberCount}/{group.maxMembers}
          </span>
          {group.date && (
            <span className="inline-flex items-center gap-1.5 text-xs text-purple-200 bg-white/5 border border-purple-500/20 rounded-full px-3 py-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {new Date(group.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        {/* Capacity bar */}
        <GlassCard className="mb-4 !p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-purple-300">Group capacity</span>
            <span className="text-white font-medium">{spotsLeft} spots left</span>
          </div>
          <div className="h-2 rounded-full bg-purple-950/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </GlassCard>

        <p className="text-purple-200 text-sm leading-relaxed mb-5">
          {group.description || 'No description yet. Group creator can add details.'}
        </p>

        {isCreator ? (
          <div className="flex gap-2 mb-5">
            <Badge className="flex-1 justify-center py-2 bg-amber-500/15 text-amber-200 border-amber-500/30">
              <Crown className="w-3.5 h-3.5 mr-1" />
              You&apos;re the host
            </Badge>
            <Button
              onClick={() => setEditing(true)}
              variant="outline"
              className="border-purple-500/30 text-purple-200"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 mb-5">
            <Button
              onClick={handleJoinLeave}
              disabled={actionLoading || (!group.isMember && spotsLeft <= 0)}
              className={`flex-1 h-12 font-semibold ${
                group.isMember
                  ? 'bg-white/10 border border-red-500/30 text-red-300 hover:bg-red-500/10'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {actionLoading ? 'Please wait...' : group.isMember ? 'Leave Group' : spotsLeft <= 0 ? 'Group Full' : 'Join Group'}
            </Button>
            <Button variant="outline" className="border-purple-500/30 text-purple-300 px-3">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          Members ({group.members?.length || 0})
        </h2>
        <div className="space-y-2">
          {(group.members || []).map((member) => (
            <Link key={member.id} href={`/traveler/${member.id}`}>
              <GlassCard className="!p-3 flex items-center gap-3 hover:!border-purple-400/50">
                <img
                  src={resolveAvatarUrl(member.avatar)}
                  alt={member.name}
                  className="w-11 h-11 rounded-full object-cover border border-purple-500/30"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{member.name}</p>
                  <p className="text-purple-400 text-xs truncate">{member.location || 'Traveler'}</p>
                </div>
                {member.id === creatorId && (
                  <Badge variant="outline" className="text-amber-300 border-amber-500/40 text-[10px]">
                    Host
                  </Badge>
                )}
              </GlassCard>
            </Link>
          ))}
        </div>
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
