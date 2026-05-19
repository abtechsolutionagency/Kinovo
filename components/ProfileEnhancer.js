'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

export function ProfileEnhancer({ onUpdate }) {
  const [input, setInput] = useState('');
  const [enhanced, setEnhanced] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function enhanceProfile() {
    if (!input.trim()) return;
    
    setLoading(true);

    try {
      const response = await fetch('/api/ai/profile-enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bio: input })
      });

      const data = await response.json();
      setEnhanced(data.profile);
    } catch (error) {
      console.error('Error enhancing profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhanced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const useProfile = () => {
    if (onUpdate) {
      onUpdate(enhanced);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Profile Enhancer</h3>
      </div>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe yourself in a few words... (e.g., 'Love travel, music festivals, meeting new people')" 
        className="min-h-[100px] bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
      />

      <Button
        onClick={enhanceProfile}
        disabled={loading || !input.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enhancing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Enhance My Profile
          </>
        )}
      </Button>

      <AnimatePresence>
        {enhanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <p className="text-purple-200 whitespace-pre-wrap">{enhanced}</p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="flex-1 bg-white/5 border-purple-500/20 text-white hover:bg-white/10"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              {onUpdate && (
                <Button
                  onClick={useProfile}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Use This Profile
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
