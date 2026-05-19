'use client';

import { useState } from 'react';
import { Upload, Sparkles, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

export function ProfileImporter({ onImport }) {
  const [input, setInput] = useState('');
  const [converted, setConverted] = useState(null);
  const [loading, setLoading] = useState(false);

  async function convertProfile() {
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
      setConverted(data.profile);
    } catch (error) {
      console.error('Error converting profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const useConverted = () => {
    if (onImport && converted) {
      onImport(converted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Upload className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Import Existing Profile</h3>
      </div>

      <p className="text-purple-300 text-sm">
        Have a profile from another platform? Paste it here and we'll help you adapt it for Kinovo.
      </p>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your existing profile text here..."
        className="min-h-[150px] bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
      />

      <Button
        onClick={convertProfile}
        disabled={loading || !input.trim()}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Converting...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Convert With AI
          </>
        )}
      </Button>

      {converted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Check className="w-4 h-4" />
              <span className="text-sm font-semibold">Converted!</span>
            </div>
            <p className="text-purple-200 whitespace-pre-wrap">{converted}</p>
          </div>
          
          {onImport && (
            <Button
              onClick={useConverted}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Use This Profile
            </Button>
          )}
        </motion.div>
      )}

      <p className="text-xs text-purple-400">
        🔒 Your data is not stored or shared. This is only for your convenience.
      </p>
    </motion.div>
  );
}
