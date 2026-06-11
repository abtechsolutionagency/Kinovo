'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X, MessageCircle, Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageContent, PageHeader } from '@/components/AppPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { connectionApi, conversationApi } from '@/lib/apiClient';
import { resolveAvatarUrl } from '@/lib/avatarUrl';
import { toast } from 'sonner';

function ConnectionRow({ connection, onAccept, onReject, onMessage, loadingId }) {
  const user = connection.user;
  const isPending = connection.status === 'pending';
  const isReceived = isPending && connection.direction === 'received';

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-purple-500/20">
      <Link href={`/traveler/${user?.id}`}>
        <img
          src={resolveAvatarUrl(user?.avatar)}
          alt={user?.name}
          className="w-14 h-14 rounded-full object-cover border border-purple-500/30"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/traveler/${user?.id}`}>
          <h3 className="text-white font-semibold truncate">{user?.name}</h3>
        </Link>
        <p className="text-purple-400 text-xs truncate">{user?.location || 'Kinovo traveler'}</p>
        <p className="text-purple-500 text-xs mt-1 capitalize">{connection.status}</p>
      </div>
      {isReceived ? (
        <div className="flex gap-2">
          <Button
            size="icon"
            disabled={loadingId === connection.id}
            onClick={() => onAccept(connection)}
            className="bg-green-600 hover:bg-green-700 h-9 w-9"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            disabled={loadingId === connection.id}
            onClick={() => onReject(connection)}
            className="border-red-500/30 text-red-300 h-9 w-9"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : connection.status === 'accepted' ? (
        <Button size="sm" onClick={() => onMessage(user?.id)} className="bg-purple-600">
          <MessageCircle className="w-4 h-4" />
        </Button>
      ) : (
        <span className="text-purple-400 text-xs">Pending</span>
      )}
    </div>
  );
}

export default function ConnectionsPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const data = await connectionApi.list(null, token);
      setConnections(data.connections || []);
    } catch {
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAccept = async (connection) => {
    setActionId(connection.id);
    try {
      const data = await connectionApi.accept(connection.id, token);
      toast.success('Connection accepted!');
      if (data.conversation?.id) {
        router.push(`/messages?conversation=${data.conversation.id}`);
      } else {
        await load();
      }
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (connection) => {
    setActionId(connection.id);
    try {
      await connectionApi.reject(connection.id, token);
      toast.success('Request declined');
      await load();
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setActionId(null);
    }
  };

  const handleMessage = async (userId) => {
    try {
      const data = await conversationApi.create(userId, token);
      router.push(`/messages?conversation=${data.conversation.id}`);
    } catch (err) {
      toast.error(err.message || 'Could not open chat');
    }
  };

  const pending = connections.filter((c) => c.status === 'pending');
  const accepted = connections.filter((c) => c.status === 'accepted');
  const received = pending.filter((c) => c.direction === 'received');
  const sent = pending.filter((c) => c.direction === 'sent');

  return (
    <AppPage>
      <PageHeader
        title="Connections"
        subtitle="Manage your travel network"
        backHref="/profile"
        action={
          received.length > 0 ? (
            <span className="px-2.5 py-1 rounded-full bg-pink-600 text-white text-xs font-medium">
              {received.length} new
            </span>
          ) : null
        }
      />

      <PageContent>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-purple-500/20">
              <TabsTrigger value="requests" className="data-[state=active]:bg-purple-600">
                Requests {received.length > 0 && `(${received.length})`}
              </TabsTrigger>
              <TabsTrigger value="connected" className="data-[state=active]:bg-purple-600">
                Connected
              </TabsTrigger>
              <TabsTrigger value="sent" className="data-[state=active]:bg-purple-600">
                Sent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="mt-6 space-y-3">
              {received.length === 0 && (
                <div className="text-center py-12 text-purple-300">
                  <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending requests</p>
                </div>
              )}
              {received.map((c) => (
                <ConnectionRow
                  key={c.id}
                  connection={c}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  loadingId={actionId}
                />
              ))}
            </TabsContent>

            <TabsContent value="connected" className="mt-6 space-y-3">
              {accepted.length === 0 && (
                <p className="text-purple-300 text-center py-12">No connections yet. Discover travelers!</p>
              )}
              {accepted.map((c) => (
                <ConnectionRow
                  key={c.id}
                  connection={c}
                  onMessage={handleMessage}
                  loadingId={actionId}
                />
              ))}
            </TabsContent>

            <TabsContent value="sent" className="mt-6 space-y-3">
              {sent.length === 0 && (
                <p className="text-purple-300 text-center py-12">No sent requests</p>
              )}
              {sent.map((c) => (
                <ConnectionRow key={c.id} connection={c} loadingId={actionId} />
              ))}
            </TabsContent>
          </Tabs>
        )}
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
